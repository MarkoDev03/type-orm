import { Column, Entity } from "typeorm";
import { Min, IsDate } from "class-validator";
import { BaseEntity } from "../base-entity";
import moment from "moment";

@Entity({ name: "avatar" })
export class Avatar extends BaseEntity {
  @Column({
    name: "userId",
    nullable: false,
    type: "int"
  })
  userId: string;

  @Column({
    name: "size",
    nullable: true,
    type: "decimal",
  })
  @Min(0)
  size: number;

  @Column({
    name: "type",
    length: 200,
    nullable: false,
    type: "nvarchar"
  })
  type: string;

  @Column({
    name: "originalName",
    length: 250,
    nullable: false,
    type: "nvarchar"
  })
  originalName: string;

  @Column({
    default: () => 'DATE_ADD(NOW(), INTERVAL 2 HOUR)',
    name: "timeUploaded",
    nullable: true,
    type: "timestamp"
  })
  @IsDate()
  timeUploaded: Date;
}