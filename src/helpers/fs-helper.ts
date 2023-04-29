import fsPromise from "fs/promises";
import pathModule from "path";

export class File {
  public static async createAsync(path: string, content: any): Promise<void> {
    await fsPromise.writeFile(path, content, { flag: "wx" });
  }

  public static async writeAsync(path: string, content: any): Promise<void> {
    await fsPromise.appendFile(path, content, { flag: "+a" });
  }

  public static async readAsync(path: string): Promise<string> {
    const data = await fsPromise.readFile(path);
    return data.toString();
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
}