import { ApplicationModule } from "@application/application.module";
import { InfrastructureModule } from "@infrastructure/infrastructure.module";
import { PersistenceModule } from "@infrastructure/persistence/persistence.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { CacheModule } from "@nestjs/cache-manager";
import { configConstant } from "@application/common/constants/config.constant";

import * as redisStore from "cache-manager-redis-store";

const redis = CacheModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    console.log(
      "conntecting to redis host ",
      configService.get(configConstant.redis.host)
    );
    return {
      store: redisStore.redisStore,
      db: configService.get(configConstant.redis.storeDB),
      host: configService.get(configConstant.redis.host),
      port: configService.get(configConstant.redis.port),
      auth_pass: configService.get(configConstant.redis.password),
    };
  },
  inject: [ConfigService],
});
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InfrastructureModule,
    PersistenceModule,
    redis,
  ],
  providers: [],

  exports: [ConfigModule, InfrastructureModule, PersistenceModule, redis],
})
export class SharedModule {}
