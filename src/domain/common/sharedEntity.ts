import { Exclude } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  BeforeUpdate,
} from "typeorm";

@Entity()
export class SharedEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdOn?: Date;
  @Exclude()
  @Column({ nullable: true })
  createdBy?: string;
  @Exclude()
  @UpdateDateColumn({ nullable: true })
  updatedOn?: Date;
  @Exclude()
  @Column({ nullable: true })
  updatedBy?: string;
  @Exclude()
  @Column({ nullable: true })
  deletedOn?: Date;
  @Exclude()
  @Column({ nullable: true })
  deletedBy?: string;
}
