'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TopicMessage extends Model {
  static boot() {
    super.boot()
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  topic() {
    return this.belongsTo('App/Models/Topic')
  }
}

module.exports = TopicMessage
