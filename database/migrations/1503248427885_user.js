'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 60).notNullable()
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')

      table.timestamps()
      table.unique(['email', 'organization_id'])
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
