import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";


@Entity({ name: "usertoken" })
export class UserToken extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;
}