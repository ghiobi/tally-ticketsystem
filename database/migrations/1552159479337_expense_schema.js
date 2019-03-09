'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExpenseSchema extends Schema {
  up() {
    this.create('expenses', (table) => {
      table.increments()
      table.string('title', 80).notNullable()
      table.string('business_purpose', 80).notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('expenses')
  }
}

module.exports = ExpenseSchema
