import fs from "fs";
import path from "path";

export class FileSystem {
  public static init(): void {
    const filesPath = path.resolve("files");

    if (!fs.existsSync(filesPath)) {
       fs.mkdirSync(filesPath);
    }
  }
}