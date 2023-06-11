import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApplicationModule } from "@application/application.module";
import { ProductShowsController } from "./controller/product-shows.controller";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ApplicationModule],
  providers: [],
  controllers: [ProductShowsController],
  exports: [],
})
export class PresentationModule {}
