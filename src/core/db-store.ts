import { DataSource } from "typeorm"
import { Environment } from "../configuration/environment";
import Logger from "./logger";
import { Constants } from "../common/constants";


class DatabaseStore {
  static dataStore = new DataSource({
    type: "mysql",
    host: Environment.DB_HOST,
    port: Environment.DB_PORT,
    username: Environment.DB_USER,
    password: Environment.DB_PASS,
    database: Environment.DB_NAME,
    entities: ["src/models/entities/*.ts"],
    logging: Environment.DB_ENABLE_QUERY_LOGGING,
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