import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class SeedService implements OnModuleInit {
  private logger = new Logger(SeedService.name);

  constructor(private dataSource: DataSource) {}
  async onModuleInit() {
    await this.seed();
  }
  async seed() {}
}
