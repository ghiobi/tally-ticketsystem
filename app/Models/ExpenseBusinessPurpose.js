'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExpenseBusinessPurpose extends Model {
  static boot() {
    super.boot()
  }
}

module.exports = ExpenseBusinessPurpose
