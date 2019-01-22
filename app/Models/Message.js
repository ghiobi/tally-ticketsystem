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

  static castDates(field, value) {
    if (['updated_at'].indexOf(field) > -1) {
      return value.format('MM/DD/YYYY h:mm A')
    }

    return super.formatDates(field, value)
  }
}

module.exports = Message
