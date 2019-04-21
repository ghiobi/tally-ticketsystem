import Ws from '@adonisjs/websocket-client'

export const CONNECTION = Ws('ws://' + location.host)
CONNECTION.connect()

export const NOTIFICATION_CHANNEL = {
  NAME: 'notifications',
  START_EVENT: 'start',
  NEW_NOTIFICATION_EVENT: 'incoming'
}
