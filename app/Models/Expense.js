'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Expense extends Model {
  static boot() {
    super.boot()
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  expenseLineItems() {
    return this.hasMany('App/Models/ExpenseLineItem')
  }
}

module.exports = Expense
