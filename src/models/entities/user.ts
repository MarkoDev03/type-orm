import { IsEmail, IsPhoneNumber, IsDate } from "class-validator";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";

@Entity({ name: "user" })
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsPhoneNumber()
  phone: string;

  @Column()
  @IsDate()
  timeCreated: Date;
}