'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TicketSchema extends Schema {
  up() {
    this.create('tickets', (table) => {
      table.increments()
      table
        .integer('opened_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
      table
        .integer('assigned_to')
        .unsigned()
        .references('id')
        .inTable('users')
      table.string('title', 80).notNullable()
      table.enu('status', ['submitted', 'replied', 'closed']).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('tickets')
  }
}

module.exports = TicketSchema
