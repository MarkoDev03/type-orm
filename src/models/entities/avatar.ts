import { Column, Entity } from "typeorm";
import { Min, IsDate } from "class-validator";
import { BaseEntity } from "../base-entity";

@Entity({ name: "avatar" })
export class Avatar extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  @Min(0)
  size: number;

  @Column()
  type: string;

  @Column()
  originalName: string;

  @Column()
  @IsDate()
  timeUploaded: Date;
}