import { configConstant } from "@application/common/constants/config.constant";
import { INestApplication } from "@nestjs/common";

export const setUpMicroservices = async (app: INestApplication) => {
  app.startAllMicroservices();
};
