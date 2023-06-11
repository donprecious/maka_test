import { ProductShow } from "@domain/entities/product-show.entity";
import { Product } from "./../../domain/entities/product.entity";
import { Show } from "@domain/entities/show.entity";
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import {
  AddProductOrUpdateModel,
  GetProductShowModel,
} from "./models/getProductShow.model";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class ProductShowService {
  logger = new Logger(ProductShowService.name);
  constructor(
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductShow)
    private productShowRepository: Repository<ProductShow>,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async addOrUpdateInventory(
    products: AddProductOrUpdateModel[]
  ): Promise<Product[]> {
    const updatedProducts: Product[] = [];
    for (const product of products) {
      let findProduct = await this.productRepository.findOne({
        where: { productId: product.productId },
      });
      if (findProduct) {
        findProduct.productName = product.productName;
        findProduct.quantity = product.quantity;
      } else {
        findProduct = this.productRepository.create({
          productId: product.productId,
          productName: product.productName,
          quantity: product.quantity,
        });
      }
      const result = await this.productRepository.save(findProduct);
      updatedProducts.push(result);
    }

    return updatedProducts;
  }

  async buyProduct(
    showId: string,
    productId: number
  ): Promise<GetProductShowModel> {
    const product = await this.productRepository.findOne({
      where: { productId: productId },
    });
    if (!product) {
      throw new NotFoundException("product not found");
    }
    if (product.quantity < 1) {
      throw new BadRequestException("Insufficient product");
    }

    let show = await this.showRepository.findOne({
      where: {
        showId: showId,
      },
    });

    if (!show) {
      show = await this.showRepository.save({
        name: "show-" + showId,
        showId: showId,
      });
    }
    let productShow = await this.productShowRepository.findOne({
      where: { showId: show.id, productId: product.id },
    });
    product.quantity -= 1;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.log(
        `attemt to save product  ${productId} and product show ${showId} `
      );
      await queryRunner.manager.update(
        Product,
        { id: product.id },
        { quantity: product.quantity }
      );

      if (productShow) {
        productShow.quantitySold += 1;
        await queryRunner.manager.update(
          ProductShow,
          { id: productShow.id },
          { quantitySold: productShow.quantitySold }
        );
      } else {
        productShow = this.productShowRepository.create({
          showId: show.id,
          productId: product.id,
          quantitySold: 1,
        });
        await queryRunner.manager.save(productShow);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made

      this.logger.log(
        `failed attemt to save product  ${productId} and product show ${showId} `
      );
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    const response = {
      itemID: product.productId,
      itemName: product.productName,
      quantity_sold: productShow.quantitySold,
    } as GetProductShowModel;
    return response;
  }

  async getSoldProducts(
    showId: string,
    productId?: number
  ): Promise<GetProductShowModel[]> {
    const key = `products-${showId}-${productId}`;
    // const cachedRecord = await this.cacheManager.get(key);
    // if (cachedRecord) {
    //   return JSON.parse(cachedRecord);
    // }
    const filter: FindOptionsWhere<ProductShow> = {
      show: {
        showId: showId,
      },
    };
    if (productId) {
      filter.product = {
        productId: productId,
      };
    }
    const productShow = await this.productShowRepository.find({
      where: filter,
      relations: {
        show: true,
        product: true,
      },
    });
    const result = productShow.map((a) => {
      const record = {
        itemID: a.product.productId,
        itemName: a.product.productName,
        quantity_sold: a.quantitySold,
      } as GetProductShowModel;

      return record;
    });
    await this.cacheManager.set(key, JSON.stringify(result), 1000);
    return result;
  }
}
