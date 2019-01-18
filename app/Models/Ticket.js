'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Ticket extends Model {
  static boot() {
    super.boot()
  }

  async updateStatus(newStatus){
    this.status = newStatus
    await this.save()
  }
}

module.exports = Ticket
