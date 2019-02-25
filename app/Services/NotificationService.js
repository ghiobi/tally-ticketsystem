'use strict'
const Ws = use('Ws')

const EmailService = use('App/Services/EmailService')
const Notification = use('App/Models/Notification')
const UserSocketMapService = use('App/Services/UserSocketMapService')

class NotificationService {
  /**
   *
   * @param users The users to notify
   * @param notification The notification to send.
   */
  send(users, notification) {
    this.validate(notification)

    users.forEach((user) => {
      notification.via.forEach((via) => {
        if (typeof this[via] === 'function') {
          this[via](user, notification).then(() => {
            // Action executed successfully.
          })
        } else {
          throw new Error(`[NotificationService] - Via '${via}' method does not exist.`)
        }
      })
    })
  }

  /**
   * Persist notification in database.
   *
   * @param user
   * @param notification
   * @returns {*}
   */
  database(user, notification) {
    return Notification.create({
      user_id: user.id,
      read: false,
      type: notification.type,
      data: notification.toJSON()
    })
  }

  /**
   * Mail user the notification.
   *
   * @param user
   * @param notification
   * @returns {*}
   */
  mail(user, notification) {
    const { data, view, subject } = notification.toMail()

    return EmailService.send(user, data, view, subject)
  }

  /**
   * Broadcast notification.
   * @param user
   * @param notification
   * @returns {Promise<*>}
   */
  async broadcast(user, notification) {
    const model = await this.database(user, notification)
    const socket = Ws.getChannel('notifications').topic('notifications')

    if (!socket) {
      return null
    }

    const ids = UserSocketMapService.get(user.id)

    return Ws.getChannel('notifications')
      .topic('notifications')
      .emitTo('incoming', model, ids)
  }

  validate(notification) {
    if (!notification) {
      throw new Error('[NotificationService] - Notification cannot be undefined or null.')
    }

    const properties = ['via', 'type']
    properties.forEach((property) => {
      if (!notification[property]) {
        throw new Error(`[NotificationService] - Notification's '${property}' property needs to be defined.`)
      }
    })

    const hasVia = (via) => notification.via.includes(via)

    if (hasVia('broadcast') && hasVia('database')) {
      throw new Error('[NotificationService] - Notification only use via broadcast and remove database.')
    }
  }
}

module.exports = NotificationService
