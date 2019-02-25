'use strict'

const UserSocketMapService = use('App/Services/UserSocketMapService')

class NotificationsController {
  constructor({ socket, auth }) {
    this.socket = socket
    this.user = auth.user

    this.init()
    socket.on('close', this.close.bind(this))
  }

  async init() {
    UserSocketMapService.add(this.user.id, this.socket.id)

    const notifications = await this.user
      .notifications()
      .where('read', false)
      .orderBy('created_at', 'desc')
      .fetch()
    this.socket.emit('start', notifications.toJSON())
  }

  close() {
    UserSocketMapService.remove(this.user.id, this.socket.id)
  }
}

module.exports = NotificationsController
