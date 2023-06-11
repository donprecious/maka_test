import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../../app.module";
import { AddProductOrUpdateModel } from "@application/shows/models/getProductShow.model";

describe("Product Shows (e2e)", () => {
  const timeOut = 10000000;
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/v1/product-shows/inventory (POST)", () => {
    it(
      "should create a product",
      () => {
        const data = [
          {
            productId: 2,
            productName: "product test",
            quantity: 3,
          },
        ] as AddProductOrUpdateModel[];

        return request(app.getHttpServer())
          .post("/v1/product-shows/inventory")
          .send(data)
          .expect(201) // replace with the correct HTTP status code
          .expect((res) => {
            const body = res.body;

            expect(body).not.toBeNull();
            expect(body.success).toBe(true);
            expect(body.data?.length).toBeGreaterThan(0);

            // put your assertions here, based on the expected response
          });
      },
      timeOut
    );
  });

  describe("/v1/product-shows/show/{showId}/buy_item/{itemId} -  (Post)", () => {
    it(
      "should be able to buy a product",
      () => {
        const queryModel = {
          // fill with valid data
        };

        return request(app.getHttpServer())
          .post(`/v1/product-shows/show/example-show-1/buy_item/2`)
          .query(queryModel)
          .expect(201) // replace with the correct HTTP status code
          .expect((res) => {
            const body = res.body;

            expect(body).not.toBeNull();
            expect(body.success).toBe(true);
            expect(body.data?.itemID).toBe(2);
            // put your assertions here, based on the expected response
          });
      },
      timeOut
    );
  });

  describe("/v1/product-shows/show/{showId}/sold_items/{itemId} -  (Get)", () => {
    it(
      "should be able to get products sold for a show",
      () => {
        return request(app.getHttpServer())
          .get(`/v1/product-shows/show/example-show-1/sold_items/2`)
          .expect(200) // replace with the correct HTTP status code
          .expect((res) => {
            const body = res.body;

            expect(body).not.toBeNull();
            expect(body.success).toBe(true);
            expect(body.data?.length).not.toBeNull();
            // put your assertions here, based on the expected response
          });
      },
      timeOut
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
