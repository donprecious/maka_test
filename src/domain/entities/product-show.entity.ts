import { SharedEntity } from "../common/sharedEntity";

import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { Product } from "./product.entity";
import { Show } from "./show.entity";

@Entity()
export class ProductShow extends SharedEntity {
  @Column()
  productId: string;
  @ManyToOne(() => Product, (product) => product.productShows)
  product: Product;

  @Column()
  showId: string;
  @ManyToOne(() => Show, (show) => show.productShows)
  show: Show;

  @Column()
  quantitySold: number;
}
