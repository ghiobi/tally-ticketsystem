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
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('organizations')

      table.string('external_id').unique()
      table.string('external_access_token')

      table.timestamps()
      table.unique(['email', 'organization_id'])
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
