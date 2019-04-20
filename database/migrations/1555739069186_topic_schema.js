'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TopicSchema extends Schema {
  up() {
    this.create('topics', (table) => {
      table.increments()
      table.timestamps()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
      table.string('title', 80).notNullable()
    })
  }

  down() {
    this.drop('topics')
  }
}

module.exports = TopicSchema
