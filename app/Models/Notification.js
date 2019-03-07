'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const castToJSON = use('App/Models/Casts/JSON')

class Notification extends Model {
  static boot() {
    super.boot()

    castToJSON(this, 'data')
  }
}

module.exports = Notification
