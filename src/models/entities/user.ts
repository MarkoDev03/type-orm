import { IsEmail, IsPhoneNumber, IsDate } from "class-validator";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";

@Entity({ name: "user" })
export class User extends BaseEntity {
  @Column({
    unique: true,
    length: 30,
    name: "username",
    nullable: false,
    type: "nvarchar"
  })
  username: string;

  @Column({
    length: 250,
    name: "password",
    nullable: false,
    type: "nvarchar"
  })
  password: string;

  @Column({
    unique: true,
    length: 50,
    name: "email",
    nullable: false,
    type: "nvarchar"
  })
  @IsEmail()
  email: string;

  @Column({
    length: 50,
    name: "phone",
    nullable: false,
    type: "nvarchar"
  })
  @IsPhoneNumber()
  phone: string;

  @Column({
    default: false,
    name: "isVerified",
    nullable: false,
    type: "boolean"
  })
  isVerified: boolean;

  @Column({
    default: () => 'DATE_ADD(NOW(), INTERVAL 2 HOUR)',
    name: "timeCreated",
    nullable: true,
    type: "timestamp"
  })
  @IsDate()
  timeCreated: Date;
}