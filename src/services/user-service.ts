import { User } from "../models/entities/user";
import { GenericService } from "./generic-service";

export class UserService extends GenericService<User> {
  constructor() {
    super(User);
  }
}