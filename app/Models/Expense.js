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

  async updateTitle(newTitle) {
    this.title = newTitle
    await this.save()
  }

  async updateBusinessPurpose(newBusinessPurpose) {
    this.business_purpose = newBusinessPurpose
    await this.save()
  }
}

module.exports = Expense
