'use strict'

const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const path = require('path')

const env = process.env.NODE_ENV || 'development'
const logDir = 'logs'

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/logfile_%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  format: format.combine(
    format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()} [${info.label}]: ${info.message}`)
  )
})

const logger = createLogger({
  level: env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [dailyRotateFileTransport]
})

module.exports = logger
