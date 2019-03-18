'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExpenseLineItemSchema extends Schema {
  up() {
    this.create('expense_line_items', (table) => {
      table.increments()
      table.string('memo', 255).notNullable()
      table.string('currency', 3).notNullable()
      table.string('category', 255).notNullable()
      table.string('region', 80).notNullable()
      table.string('text', 'text')
      table.float('price', 12, 2).notNullable()
      table.float('tax', 12, 2).notNullable()
      table.binary('picture')
      table
        .integer('expense_id')
        .unsigned()
        .references('id')
        .inTable('expenses')
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('expense_line_items')
  }
}

module.exports = ExpenseLineItemSchema
