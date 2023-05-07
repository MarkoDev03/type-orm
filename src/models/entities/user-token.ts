import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";

@Entity({ name: "usertoken" })
export class UserToken extends BaseEntity {
  @Column({
    name: "userId",
    nullable: false,
    type: "int"
  })
  userId: number;

  @Column({
    name: "token",
    length: 200,
    unique: true,
    nullable: false,
    type: "nvarchar"
  })
  token: string;

  @Column({
    default:  () => 'DATE_ADD(NOW(), INTERVAL 2 HOUR)',
    name: "expiresAt",
    nullable: true,
    type: "timestamp"
  })
  expiresAt: Date;
}