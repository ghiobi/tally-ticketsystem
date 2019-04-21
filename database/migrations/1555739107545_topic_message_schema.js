'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TopicMessageSchema extends Schema {
  up() {
    this.create('topic_messages', (table) => {
      table.increments()
      table.timestamps()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
      table
        .integer('topic_id')
        .unsigned()
        .references('id')
        .inTable('topics')
        .notNullable()
      table.text('body', 'text').notNullable()
    })
  }

  down() {
    this.drop('topic_messages')
  }
}

module.exports = TopicMessageSchema
