import { DataSource } from "typeorm"
import { Enviroment } from "../common/enviroment";
import Logger from "./logger";
import { Constants } from "../common/constants";


class DatabaseStore {
  static dataStore = new DataSource({
    type: "mysql",
    host: Enviroment.DB_HOST,
    port: Enviroment.DB_PORT,
    username: Enviroment.DB_USER,
    password: Enviroment.DB_PASS,
    database: Enviroment.DB_NAME,
    entities: ["src/models/entities/*.ts"],
    logging: Enviroment.DB_ENABLE_QUERY_LOGGING,
    synchronize: true,
    insecureAuth: true,
  });

  public static init() {
    this.dataStore.initialize()
      .then(() => Logger.info(Constants.DBStoreInitialized))
      .catch((e) => {
        Logger.error(Constants.FailedToDBStoreInitialized);
        Logger.error(e);
      });
  }
}

export {  DatabaseStore };