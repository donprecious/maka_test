import { Column, Entity, OneToMany } from "typeorm";
import { SharedEntity } from "../common/sharedEntity";
import { ProductShow } from "./product-show.entity";
@Entity()
export class Product extends SharedEntity {
  @Column({ unique: true })
  productId: number;

  @Column()
  productName: string;

  @Column({ type: "numeric" })
  quantity: number;

  @OneToMany(() => ProductShow, (productShow) => productShow.show)
  productShows: ProductShow[];
}
