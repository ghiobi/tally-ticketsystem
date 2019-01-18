'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Organization extends Model {
  static boot() {
    super.boot()
  }

  users() {
    return this.hasMany('App/Models/User')
  }
}

module.exports = Organization
