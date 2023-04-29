import scheduler from "node-cron";
import Logger from "../core/logger";
import { Constants } from "../common/constants";
import { InvalidArgumentError } from "../errors/server-errors";
import uuid from "uuid";

export class CronJob {

  private static DateToCron(date: Date): string {
    var date = new Date("2017-05-09T01:30:00.123Z");

    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let dayofmonth = date.getDate();
    let month = date.getMonth();
    let dayofweek = date.getDay();

    return `${mins} ${secs} ${dayofmonth} ${month} ${dayofweek}`;
  }

  public static executeNow(task: any): void {
    Logger.warn(Constants.TaskScheduled);

    const bgTask = scheduler.schedule("* * * * * * ", async () => await task(), {
      scheduled: false,
      recoverMissedExecutions: true,
      timezone: "UTC",
      name: task.name + uuid.v4()
    });

    Logger.info(Constants.StartedTask);

    bgTask.start();
  }

  public static schedule(cronExp: string | Date, task: any): void {

    const cronTime = typeof(cronExp) == "string" ? cronExp : this.DateToCron(cronExp);

    if (!scheduler.validate(cronTime)) {
      throw new InvalidArgumentError(Constants.InvalidExp);
    }

    Logger.warn(Constants.TaskScheduled);

    scheduler.schedule(cronTime, async () => await task(), {
      scheduled: true,
      recoverMissedExecutions: true,
      timezone: "UTC",
      name: task.name + uuid.v4()
    });
  }

  public static getAll(): Map<string, scheduler.ScheduledTask> {
    return scheduler.getTasks();
  }

  public static gettaskById(id: string): scheduler.ScheduledTask {
    let list = this.getAll();
    let task = list.get(id);
    return task;
  }
}