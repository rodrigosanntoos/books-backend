/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageContext, ClsContextNamespace } from './../cls'

export class LoggerContext {
  /**
   * Sets correlation id
   * The setted correlationId will be printed in every application log
   * @param correlationId: {string}
   */
  public static setCorrelationId(correlationId: string) {
    StorageContext.scope()
    StorageContext.setContextValue('correlationId', correlationId, ClsContextNamespace.LOGGER)
  }

  /**
   * Gets correlation id
   * @returns correlation id {string}
   */
  public static getCorrelationId(): string {
    const value: string = StorageContext.getContextValue('correlationId', ClsContextNamespace.LOGGER)
    return value
  }

  /**
   * Extra data
   * You can set some extra info to you log
   * For Example: You can specify the user loggedId so everytime your user has logged in just add the id here and a key then in every appliction log the user id will be logged
   * @param key: {string}
   * @param value: {string}
   */
  public static setLogInfoData(key: string, value: unknown) {
    const data = LoggerContext.getLogInfoData()
    data[key] = value
    StorageContext.setContextValue('extraLogInfo', data, ClsContextNamespace.LOGGER)
  }

  /**
   * Extra data
   * Returns the storaged extra log data
   */
  public static getLogInfoData(): { [key: string]: unknown } {
    const data: { [key: string]: unknown } = StorageContext.getContextValue('extraLogInfo', ClsContextNamespace.LOGGER)
    return data || {}
  }
}
