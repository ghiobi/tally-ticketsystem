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

  static get updated_at() {
    return super.dates.concat(['updated_at'])
  }
  /**
    castDates is called when doing message.toJSON()
   */
  static castDates(field, value) {
    if ('updated_at' === field) {
      return value.format('MM/DD/YYYY h:mm A')
    }

    return super.formatDates(field, value)
  }
}

module.exports = Message
