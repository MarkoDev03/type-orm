import scheduler from "node-cron";
import Logger from "../core/logger";
import { Constants } from "../common/constants";
import { InvalidArgumentError } from "../errors/server-errors";
import { v4 } from "uuid";

export class CronJob {

  private static DateToCron(date: Date): string {
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let dayofmonth = date.getDate();
    let month = date.getMonth();
    let dayofweek = date.getDay();

    return `${mins} ${secs} ${dayofmonth} ${month} ${dayofweek}`;
  }

  public static executeNow(task: any): void {
    let taskId =  v4();

    Logger.warn(Constants.TaskScheduled + taskId);

    const bgTask = scheduler.schedule("* * * * * * ", async () => await task(), {
      scheduled: false,
      recoverMissedExecutions: true,
      timezone: "UTC",
      name: taskId
    });

    Logger.warn(Constants.StartedTask);

    bgTask.start();

    Logger.info(Constants.TaskExecuted + taskId);
  }

  public static schedule(cronExp: string | Date, task: any): void {

    let taskId = v4();
    
    const cronTime = typeof(cronExp) == "string" ? cronExp : this.DateToCron(cronExp);

    if (!scheduler.validate(cronTime)) {
      throw new InvalidArgumentError(Constants.InvalidExp);
    }

    Logger.warn(Constants.TaskScheduled + taskId + " for " + cronExp);

    scheduler.schedule(cronTime, async () => await task(), {
      scheduled: true,
      recoverMissedExecutions: true,
      timezone: "UTC",
      name: taskId
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
