'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TicketSchema extends Schema {
  up() {
    this.table('tickets', (table) => {
      // alter table
      table.dropColumn('organization_id')
    })
  }

  down() {
    this.table('tickets', (table) => {
      // reverse alternations
      table
        .integer('organization_id')
        .notNullable()
        .defaultTo(0)
        .unsigned()
        .references('id')
        .inTable('organization')
    })
  }
}

module.exports = TicketSchema
