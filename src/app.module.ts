import { PersistenceModule } from "./infrastructure/persistence/persistence.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "@application/common/exceptions/exceptionhandler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configConstant } from "@application/common/constants/config.constant";
import { domainEntities } from "@domain/entities/entities";
import { ApplicationModule } from "@application/application.module";
import { PresentationModule } from "@presentation/presentation.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PersistenceModule,
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: "postgres",

          host: configService.get(configConstant.database.host),
          port: configService.get(configConstant.database.port),
          username: configService.get(configConstant.database.username),
          password: configService
            .get<string>(configConstant.database.password)
            ?.toString(),
          database: configService.get(configConstant.database.name),
          entities: [...domainEntities],
          synchronize: false,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
