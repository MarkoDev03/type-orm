import { Avatar } from "../models/entities/avatar";
import { GenericService } from "./generic-service";

export class AvatarService extends GenericService<Avatar> {
  constructor() {
    super(Avatar);
  }
}