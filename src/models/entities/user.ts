import { IsEmail, IsPhoneNumber, IsDate } from "class-validator";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";

@Entity({ name: "user" })
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsPhoneNumber()
  phone: string;
  
  @Column()
  isVerified: boolean;

  @Column()
  @IsDate()
  timeCreated: Date;
}