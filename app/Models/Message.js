'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Message extends Model {
  static boot() {
    super.boot()
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  ticket() {
    return this.belongsTo('App/Models/Ticket')
  }
}

module.exports = Message
