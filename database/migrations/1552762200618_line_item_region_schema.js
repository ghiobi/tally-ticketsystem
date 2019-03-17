'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LineItemRegionSchema extends Schema {
  up() {
    this.create('line_item_regions', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('display', 80).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('line_item_regions')
  }
}

module.exports = LineItemRegionSchema
