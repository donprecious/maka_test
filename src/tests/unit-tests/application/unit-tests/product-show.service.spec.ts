import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { Connection, DataSource, Repository } from "typeorm";

import { domainEntities } from "@domain/entities/entities";

import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ProductShowService } from "@application/shows/product-show.service";
import { ProductShow } from "@domain/entities/product-show.entity";
import { AddProductOrUpdateModel } from "@application/shows/models/getProductShow.model";
import { Show } from "@domain/entities/show.entity";
import { Product } from "@domain/entities/product.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("ProductShow Service", () => {
  let service: ProductShowService;
  let productShowRepo: Repository<ProductShow>;
  let productRepo: Repository<Product>;
  let showRepo: Repository<Show>;
  const timeOut = 10000000;
  let moduleRef: TestingModule;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [...domainEntities],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([...domainEntities]),
      ],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
        ProductShowService,
      ],
    }).compile();

    service = moduleRef.get<ProductShowService>(ProductShowService);
    productShowRepo = moduleRef.get<Repository<ProductShow>>(
      getRepositoryToken(ProductShow)
    );

    productRepo = moduleRef.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
    showRepo = moduleRef.get<Repository<Show>>(getRepositoryToken(Show));

    // setup some products
    const products: AddProductOrUpdateModel[] = [
      {
        productId: 1,
        productName: "latest women wear",
        quantity: 3,
      },
      {
        productId: 2,
        productName: "glove women wear",
        quantity: 1,
      },
      {
        productId: 3,
        productName: "simple stes latest women wear",
        quantity: 4,
      },
    ];

    const result = await service.addOrUpdateInventory(products);
    console.log("initailly created some products");
  }, timeOut);

  describe("product show service", () => {
    it(
      "can add product",
      async () => {
        const products: AddProductOrUpdateModel[] = [
          {
            productId: 10,
            productName: "mean latest women wear",
            quantity: 3,
          },
          {
            productId: 11,
            productName: "lucas latest women wear",
            quantity: 1,
          },
        ];

        const result = await service.addOrUpdateInventory(products);

        expect(result).not.toBeNull();
        expect(result.length).toBeGreaterThan(0);
        expect(result.length).toBe(2);
      },
      timeOut
    );

    it(
      "should buy product and update product show correctly",
      async () => {
        // Arrange

        const showId = "test-show-1";
        const productId = 1;
        // Act
        const result = await service.buyProduct(showId, productId);
        // Assert
        expect(result).toBeDefined();
        expect(result.itemID).toEqual(productId);
        expect(result.quantity_sold).toBeGreaterThan(0);
      },
      timeOut
    );

    it("should get sold products correctly", async () => {
      // Arrange
      const showId = "test-show-1";
      const productId = 1;
      // Act
      const result = await service.getSoldProducts(showId, productId);
      // Assert
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should throw error when buying a non-existent product", async () => {
      const showId = "test-show-1";
      const productId = 999; // non-existent productId

      await expect(service.buyProduct(showId, productId)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw error when buying a product with insufficient quantity", async () => {
      const showId = "test-show-1";
      const productId = 1;
      // update product 1 with zero unit
      const product = await productRepo.update(
        { productId: productId },
        {
          quantity: 0,
        }
      );
      await expect(service.buyProduct(showId, productId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  afterAll(async () => {
    const datasource = moduleRef.get(DataSource);
    await datasource.dropDatabase();
    await datasource.destroy();
  });
});
