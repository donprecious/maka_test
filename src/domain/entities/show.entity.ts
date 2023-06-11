import { Column, Entity, OneToMany } from "typeorm";
import { SharedEntity } from "../common/sharedEntity";
import { ProductShow } from "./product-show.entity";
@Entity()
export class Show extends SharedEntity {
  name: string;

  @Column({ unique: true })
  showId: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => ProductShow, (productShow) => productShow.show)
  productShows: ProductShow[];
}
