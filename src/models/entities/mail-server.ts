import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";
import { IsEmail } from "class-validator";

@Entity({ name: "mailserver" })
export class MailServer extends BaseEntity {
   @Column({
      name: "host",
      length: 200,
      nullable: false,
      type: "nvarchar",
   })
   host: string;

   @Column({
      name: "port",
      nullable: false,
      type: "int",
   })
   port: number;

   @Column({
      name: "senderMail",
      length: 200,
      nullable: false,
      type: "nvarchar",
   })
   @IsEmail()
   senderMail: string;

   @Column({
      name: "senderPassword",
      length: 200,
      nullable: false,
      type: "nvarchar",
   })
   senderPassword: string;

   @Column({
      name: "serviceType",
      length: 30,
      nullable: false,
      type: "nvarchar",
   })
   serviceType: string;

   @Column({
      name: "enabled",
      default: true,
      nullable: true,
      type: "boolean"
   })
   enabled: boolean;
}