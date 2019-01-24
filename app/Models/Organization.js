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

  tickets() {
    return this.manyThrough('App/Models/User', 'tickets')
  }

  /**
   * Finds a user within an organization.
   *
   * @param organization
   * @param email
   * @returns {*}
   */
  findUserByEmail(email) {
    return this.users()
      .where('email', email)
      .first()
  }
}

module.exports = Organization
