/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { SeedService } from "./typeorm/seed/seedservice";
import { typeORMFeature } from "@/common/constant/typeormFeature";
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), typeORMFeature],
  providers: [SeedService],
  exports: [typeORMFeature],
})
export class PersistenceModule {}
