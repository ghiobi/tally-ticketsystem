'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleSchema extends Schema {
  up() {
    this.create('roles', (table) => {
      table.increments()
      table
        .string('key', 80)
        .unique()
        .notNullable()
      table.string('display_name', 80).notNullable()
    })

    this.create('role_user', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')

      table.unique(['user_id', 'role_id'])
    })
  }

  down() {
    this.drop('roles')
    this.drop('role_user')
  }
}

module.exports = RoleSchema
