import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export enum LOG_LEVEL {
  LOG,
  WARN,
  ERROR
}

@Injectable()
export class Logger {
  private static _log(message: string, level: LOG_LEVEL = LOG_LEVEL.LOG, args: any = null): void {
    if (!environment.production) {
      const textLevel = ['LOG', 'WARN', 'ERROR'][level]
      const style = `color: ${['#7C9299', '#FFB100', '#E74646'][level]};`;
      const log = `%c[${textLevel}]${message}`;

      console.log(log, style)
      if (args) {
        console.log(args)
      }
    }
  }

  public static log(message: string, arg: any = null): void {
    this._log(message, LOG_LEVEL.LOG, arg);
  }
  public static warn(message: string, arg: any = null): void {
    this._log(message, LOG_LEVEL.WARN, arg);
  }
  public static error(message: string, arg: any = null): void {
    this._log(message, LOG_LEVEL.ERROR, arg);
  }
}
