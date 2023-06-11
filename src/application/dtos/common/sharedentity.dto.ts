import { Exclude } from 'class-transformer';

export class SharedEntityDto {
  id?: string;

  createdOn?: Date;

  @Exclude()
  createdBy?: string;
  @Exclude()
  updatedOn?: Date;
  @Exclude()
  updatedBy?: string;
  @Exclude()
  deletedOn?: Date;
  @Exclude()
  deletedBy?: string;
}
