import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";


@Entity({ name: "settings" })
export class Settings extends BaseEntity {
  @Column({
    name: "key",
    length: 200,
    nullable: false,
    type: "nvarchar"
  })
  key: string;

  @Column({
    name: "value",
    length: 200,
    nullable: false,
    type: "nvarchar"
  })
  value: string;

  @Column({
    name: "description",
    length: 500,
    nullable: false,
    type: "nvarchar"
  })
  description: string;
}