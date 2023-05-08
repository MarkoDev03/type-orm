import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import pathModule from "path";

export class FileSystem {
  public static init(): void {
    const filesPath = path.resolve("files");

    if (!fs.existsSync(filesPath)) {
      fs.mkdirSync(filesPath);
    }
  }
}

export class File {
  public static async createAsync(path: string, content: any): Promise<void> {
    await fsPromise.writeFile(path, content, { flag: "wx" });
  }

  public static async writeAsync(path: string, content: any): Promise<void> {
    await fsPromise.appendFile(path, content, { flag: "+a" });
  }

  public static async readAsync(path: string): Promise<Buffer> {
    const data = await fsPromise.readFile(path);
    return data;
  }

  public static async updateAsync(path: string, content: any): Promise<void> {
    await fsPromise.writeFile(path, content, { flag: "x", encoding: "utf8" });
  }

  public static async deleteAsync(path: string): Promise<void> {
    await fsPromise.rm(path);
  }

  public static async renameAsync(path: string, name: string): Promise<void> {
    const newName = `${name}.${pathModule.extname(path)}`;
    const oldName = pathModule.basename(path);
    const newPath = path.replace(oldName, newName);

    await fsPromise.rename(path, newPath);
  }

  public static async getInfoAsync(path: string): Promise<any> {
    await fsPromise.stat(path);
  }

  public static async existAsync(filePath: string): Promise<boolean> {
    const filesPath = path.resolve(filePath);

    try {
      await fsPromise.access(filesPath);
      return true;
    } catch {
      return false;
    }
  }
}

export class Directory {
  public static async existAsync(directoryPath: string): Promise<boolean> {
    const filesPath = path.resolve(directoryPath);

    try {
      await fsPromise.access(filesPath);
      return true;
    } catch {
      return false;
    }
  }

  public static async createAsync(directoryPath: string): Promise<void> {
     await fsPromise.mkdir(directoryPath);
  }

  public static async deleteAsync(directoryPath: string): Promise<void> {
    await fsPromise.rmdir(directoryPath);
  }

  public static async readAsync(directoryPath: string): Promise<string[]> {
    return await fsPromise.readdir(directoryPath);
  }
}