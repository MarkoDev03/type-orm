import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";


@Entity({ name: "settings" })
export class Settings extends BaseEntity {
  @Column()
  key: string;

  @Column()
  value: string;

  @Column()
  description: string;
}