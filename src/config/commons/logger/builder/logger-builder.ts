/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, createLogger, transports, Logger } from 'winston'
import { v4 as uuid } from 'uuid'
import { Environment } from './../env/environment'
import { LoggerContext } from '../log/loger-context'

export class LoggerBuilder {
  private static defaultCustom = (info: { [key: string]: any }, opts: any) => {
    if (opts.yell) {
      info.message = info.message.toUpperCase()
    } else if (opts.whisper) {
      info.message = info.message.toLowerCase()
    }

    info.level = info.level.toUpperCase()
    info.level = info.level.toUpperCase()
    info.correlationId = LoggerContext.getCorrelationId() || uuid()
    const extraData = LoggerContext.getLogInfoData()
    if (extraData) {
      Object.keys(extraData).forEach(key => {
        info[key] = extraData[key]
      })
    }

    let text
    for (const item of info.message) {
      if (typeof item == 'string') {
        text = `${!text ? item : `${text} ${item}`}`
      } else if (Array.isArray(item)) {
        for (const arrayItem of item) {
          if (arrayItem instanceof TypeError) {
            text = `${!text ? item : `${text} ${arrayItem.message}`}`
            info['stackError'] = arrayItem.stack
          } else if (typeof arrayItem == 'string') {
            text = `${!text ? arrayItem : `${text} ${arrayItem}`}`
          } else {
            if (Object.keys(arrayItem).length > 0) {
              Object.keys(arrayItem).forEach(key => {
                info[key] = arrayItem[key] === null || arrayItem[key] === undefined ? '' : arrayItem[key]
              })
            } else {
              info['__data'] = arrayItem
            }
          }
        }
      }
    }
    delete info.message

    info.message = text

    return info
  }
  /**
   * You can specify a custom json formatter function that will be called everytime before print a log
   * @param [customFormat]
   * @returns instance {Logger}
   */
  static getLogger(custom?: (info: any, opts?: any) => any): Logger {
    return process.env.NODE_ENV == Environment.LOCAL
      ? LoggerBuilder.createLocalWinstonLogger(custom)
      : LoggerBuilder.createDefaultWinstonLogger(custom)
  }

  /**
   * Creates local winston logger
   * @returns local winston logger {Logger}
   */
  private static createLocalWinstonLogger(
    custom: (info: any, opts?: any) => any = LoggerBuilder.defaultCustom,
  ): Logger {
    return createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      format: format.combine(
        format.json(),
        LoggerBuilder.customJsonFormat(custom),
        format.timestamp(),
        format.prettyPrint(),
      ),
      transports: [new transports.Console()],
    })
  }
  /**
   * Creates aws winston logger
   * @returns aws winston logger {Logger}
   */
  private static createDefaultWinstonLogger(
    custom: (info: any, opts?: any) => any = LoggerBuilder.defaultCustom,
  ): Logger {
    return createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      format: format.combine(format.timestamp(), LoggerBuilder.customJsonFormat(custom), format.json()),
      transports: [new transports.Console()],
    })
  }

  /**
   * Customs json format
   * @returns
   */
  private static customJsonFormat(custom: (info: any, opts?: any) => any = LoggerBuilder.defaultCustom) {
    const customJson = format(custom)
    return customJson()
  }
}
