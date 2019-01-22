'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TicketSchema extends Schema {
  up() {
    this.drop('tickets')

    this.create('tickets', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
      table
        .integer('assigned_to')
        .unsigned()
        .references('id')
        .inTable('users')
      table
        .integer('organization_id')
        .notNullable()
        .defaultTo(0)
        .unsigned()
        .references('id')
        .inTable('organization')
      table
        .string('description', 255)
        .defaultTo('')
        .notNullable()
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
