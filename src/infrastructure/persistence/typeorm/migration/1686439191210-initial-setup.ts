import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1686439191210 implements MigrationInterface {
  name = "InitialSetup1686439191210";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP DEFAULT now(), "updatedBy" character varying, "deletedOn" TIMESTAMP, "deletedBy" character varying, "productId" integer NOT NULL, "productName" character varying NOT NULL, "quantity" numeric NOT NULL, CONSTRAINT "UQ_429540a50a9f1fbf87efd047f35" UNIQUE ("productId"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "show" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP DEFAULT now(), "updatedBy" character varying, "deletedOn" TIMESTAMP, "deletedBy" character varying, "showId" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_c907eecf6e10114f622e2aa25ed" UNIQUE ("showId"), CONSTRAINT "PK_e9993c2777c1d0907e845fce4d1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "product_show" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP DEFAULT now(), "updatedBy" character varying, "deletedOn" TIMESTAMP, "deletedBy" character varying, "productId" uuid NOT NULL, "showId" uuid NOT NULL, "quantitySold" integer NOT NULL, CONSTRAINT "PK_65cb1767c548a9079cf79df2254" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "product_show" ADD CONSTRAINT "FK_9f1867c3d49b63adad35523f1fc" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "product_show" ADD CONSTRAINT "FK_f7ef7029a40ae9def68a56d8df3" FOREIGN KEY ("showId") REFERENCES "show"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_show" DROP CONSTRAINT "FK_f7ef7029a40ae9def68a56d8df3"`
    );
    await queryRunner.query(
      `ALTER TABLE "product_show" DROP CONSTRAINT "FK_9f1867c3d49b63adad35523f1fc"`
    );
    await queryRunner.query(`DROP TABLE "product_show"`);
    await queryRunner.query(`DROP TABLE "show"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
