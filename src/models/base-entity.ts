import { PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
  @PrimaryColumn({
    name: "id",
    type: "int",
    nullable: false
  })
  @PrimaryGeneratedColumn()
  id: number;
}