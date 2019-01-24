'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Ticket extends Model {
  static boot() {
    super.boot()
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  assignedTo() {
    return this.belongsTo('App/Models/User', 'assigned_to', 'id')
  }

  messages() {
    return this.hasMany('App/Models/Message')
  }

  async updateStatus(newStatus) {
    this.status = newStatus
    await this.save()
  }
}

module.exports = Ticket
