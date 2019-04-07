'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LineItemBusinessPurposeSchema extends Schema {
  up() {
    this.create('expense_business_purposes', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('expense_business_purposes')
  }
}

module.exports = LineItemBusinessPurposeSchema
