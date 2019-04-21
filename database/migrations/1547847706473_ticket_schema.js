'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TicketSchema extends Schema {
  up() {
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
        .defaultTo(null)
      table.string('title', 80).notNullable()
      table
        .enu('status', ['submitted', 'replied', 'closed'])
        .notNullable()
        .defaultTo('submitted')
      table
        .integer('rating')
        .defaultTo(null)
        .nullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('tickets')
  }
}

module.exports = TicketSchema
