import { ResultType } from "@/common/model/response.model";
import {
  AddProductOrUpdateModel,
  GetProductShowModel,
} from "@application/shows/models/getProductShow.model";
import { ProductShowService } from "@application/shows/product-show.service";
import { ProductShow } from "@domain/entities/product-show.entity";
import { Product } from "@domain/entities/product.entity";

import {
  Injectable,
  Controller,
  Inject,
  Get,
  Query,
  Body,
  Post,
  Param,
} from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiProperty,
  ApiTags,
} from "@nestjs/swagger";

@Injectable()
@ApiTags("product-shows")
@Controller("v1/product-shows")
export class ProductShowsController {
  /**
   *
   */
  constructor(private productShowService: ProductShowService) {}

  @Post("inventory")
  @ApiBody({ type: [AddProductOrUpdateModel] })
  async createProducts(
    @Body()
    products: AddProductOrUpdateModel[]
  ): Promise<ResultType<Product[]>> {
    const result = await this.productShowService.addOrUpdateInventory(products);
    return ResultType.Ok<Product[]>(result);
  }

  @Post("/show/:showId/buy_item/:itemId")
  async Buy(
    @Param("showId") showId: string,
    @Param("itemId") itemId: number
  ): Promise<ResultType<GetProductShowModel>> {
    const result = await this.productShowService.buyProduct(showId, itemId);
    return ResultType.Ok<GetProductShowModel>(result);
  }

  @Get("/show/:showId/sold_items/:itemId")
  async GetSoldItems(
    @Param("showId") showId: string,
    @Param("itemId") itemId?: number
  ): Promise<ResultType<GetProductShowModel[]>> {
    const result = await this.productShowService.getSoldProducts(
      showId,
      itemId
    );
    return ResultType.Ok<GetProductShowModel[]>(result);
  }
}
