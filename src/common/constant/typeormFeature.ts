import { domainEntities } from "@domain/entities/entities";
import { TypeOrmModule } from "@nestjs/typeorm";

export const typeORMFeature = TypeOrmModule.forFeature([...domainEntities]);
