'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TicketSchema extends Schema {
  up() {
    this.table('tickets', (table) => {
      // alter table
      table.dropColumn('description')
    })
  }

  down() {
    this.table('tickets', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TicketSchema
