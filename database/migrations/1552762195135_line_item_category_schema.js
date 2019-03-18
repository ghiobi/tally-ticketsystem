'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LineItemCategorySchema extends Schema {
  up() {
    this.create('line_item_categories', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('line_item_categories')
  }
}

module.exports = LineItemCategorySchema
