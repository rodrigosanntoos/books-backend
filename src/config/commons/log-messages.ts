import { createLogger, transports, format } from 'winston'

const Logger = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  Logger.add(
    new transports.Console({
      format: format.json(),
    }),
  )
}

export { Logger }
