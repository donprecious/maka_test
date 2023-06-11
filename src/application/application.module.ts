import { typeORMFeature } from "@/common/constant/typeormFeature";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SharedModule } from "@/common/module/shared.module";

import { ProductShowService } from "./shows/product-show.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    typeORMFeature,
    SharedModule,
  ],
  providers: [ProductShowService],
  exports: [typeORMFeature, ProductShowService],
})
export class ApplicationModule {}
