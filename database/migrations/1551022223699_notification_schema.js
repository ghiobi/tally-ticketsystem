'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up() {
    this.create('notifications', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
      table.jsonb('data')
      table.string('type').notNullable()
      table.boolean('read').defaultTo(false)
      table.timestamps()
    })
  }

  down() {
    this.drop('notifications')
  }
}

module.exports = NotificationSchema
