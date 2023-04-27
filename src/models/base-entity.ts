import { PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
}