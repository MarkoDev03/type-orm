import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base-entity";
import { IsEmail } from "class-validator";


@Entity({ name: "mailserver" })
export class MailServer extends BaseEntity {
   @Column()
   host: string;

   @Column()
   port: number;

   @Column()
   @IsEmail()
   senderMail: string;

   @Column()
   senderPassword: string;

   @Column()
   serviceType: string;

   @Column()
   enabled: boolean;
}