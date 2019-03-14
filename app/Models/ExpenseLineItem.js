'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExpenseLineItem extends Model {
  static boot() {
    super.boot()
  }

  expense() {
    return this.belongsTo('App/Models/Expense')
  }

  async updateMemo(newMemo) {
    this.memo = newMemo
    await this.save()
  }

  async updateCurrency(newCurrency) {
    this.currency = newCurrency
    await this.save()
  }

  async updateCategory(newCategory) {
    this.category = newCategory
    await this.save()
  }

  async updateRegion(newRegion) {
    this.region = newRegion
    await this.save()
  }

  async updateText(newText) {
    this.text = newText
    await this.save()
  }

  async updatePrice(newPrice) {
    this.price = newPrice
    await this.save()
  }

  async updateTax(newTax) {
    this.tax = newTax
    await this.save()
  }
}

module.exports = ExpenseLineItem
