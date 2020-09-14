/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */
require('dotenv').config()
import * as CallerModule from 'caller-module'
import * as Winston from 'winston'
export * from '../decorator/log-decorator'
import { LoggerBuilder } from '../builder/logger-builder'
import { LoggerContext } from './loger-context'

class LoggerClass extends LoggerContext {
  private winston: Winston.Logger
  public readonly level: string

  private static instance: LoggerClass

  constructor(winston: Winston.Logger) {
    super()
    this.winston = winston
    this.level = winston.level
  }

  debug(...args: unknown[]) {
    args.push(this.getTraceLog(this.debug))
    this.winston.debug(this.handleNull(args))
  }

  error(...args: unknown[]) {
    args.push(this.getTraceLog(this.error))
    this.winston.error(this.handleNull(args))
  }

  info(...args: unknown[]) {
    args.push(this.getTraceLog(this.info))
    this.winston.info(this.handleNull(args))
  }

  warn(...args: unknown[]) {
    args.push(this.getTraceLog(this.warn))
    this.winston.warn(this.handleNull(args))
  }

  profile(id: string | number, meta?: Winston.LogEntry): Winston.Logger {
    return this.winston.profile(id, meta)
  }
  startTimer(): Winston.Profiler {
    return this.winston.startTimer()
  }

  private handleNull(...args: unknown[]): Array<unknown> {
    if (!args) {
      return []
    }
    args.forEach(arg => {
      if (arg === null || arg === undefined) {
        arg = 'null'
      }
    })
    return args
  }
  private getTraceLog(func: any) {
    try {
      return {
        class: `${CallerModule.GetCallerModule(func).callSite.getTypeName()}`,
      }
    } catch (err) {
      return {
        class: '',
      }
    }
  }

  /**
   * Singleton responsible for return an Logger instance
   * You can specify a custom json formatter function that will be called everytime before print a log
   * @param [customFormat]
   * @returns instance {Logger}
   */
  static getInstance(customFormat?: (info: { [key: string]: any }, opts?: any) => any): LoggerClass {
    if (!LoggerClass.instance) {
      LoggerClass.instance = new LoggerClass(LoggerBuilder.getLogger(customFormat))
    }

    return LoggerClass.instance
  }
}

const Logger: LoggerClass = LoggerClass.getInstance()

const buildLogger = LoggerBuilder.getLogger

export { Logger, buildLogger }
