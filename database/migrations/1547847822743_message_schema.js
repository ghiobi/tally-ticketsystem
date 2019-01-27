'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up() {
    this.create('messages', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
      table
        .integer('ticket_id')
        .unsigned()
        .references('id')
        .inTable('tickets')
        .notNullable()
      table.text('body', 'text').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('messages')
  }
}

module.exports = MessageSchema
