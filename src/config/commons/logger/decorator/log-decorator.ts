/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */
import { Logger } from '../log/logger'
import { LogActions } from '../log'
interface LogTrace {
  action: string
  method: string
  class: string
  function: string
  parameters?: any
  hasFailed?: boolean
  duration?: number
  errorMessage?: unknown
}

function handleParameters(args, parameters) {
  for (const parameter of parameters) {
    if (typeof parameter == 'object') {
      if (parameter != null && parameter && parameter.constructor.name === 'Object') {
        args.push(parameter)
      }
    } else {
      args.push(parameter)
    }
  }
  return args
}

function handlerMethodTrace(logTrace: LogTrace, start: Date, err?: Error) {
  if (err) {
    logTrace.hasFailed = true
    logTrace.errorMessage = err.message
  }
  logTrace.duration = new Date().getTime() - start.getTime()
  Logger.debug(`Called method: ${logTrace.method}`, logTrace)
}

function handleAsyncFunction(result: any, logTrace: LogTrace, start: Date) {
  return new Promise((resolve, reject) => {
    result
      .then(funcResult => {
        handlerMethodTrace(logTrace, start)
        return resolve(funcResult)
      })
      .catch(err => {
        handlerMethodTrace(logTrace, start, err)
        return reject(err)
      })
  })
}
const log = (target: any, key: PropertyKey, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = function() {
    const start = new Date()
    const args = handleParameters([], arguments)

    const logTrace: LogTrace = {
      action: LogActions.MethodTrace,
      method: `${this.constructor.name}.${String(key)}`,
      class: this.constructor.name,
      function: String(key),
      parameters: args,
      hasFailed: false,
    }
    try {
      const result = originalMethod.apply(this, arguments)
      if (result instanceof Promise) {
        return handleAsyncFunction(result, logTrace, start)
      } else {
        handlerMethodTrace(logTrace, start)
        return result
      }
    } catch (err) {
      handlerMethodTrace(logTrace, start, err)
      return err
    }
  }
  return descriptor
}

export { log }
