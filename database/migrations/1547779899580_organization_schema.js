'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrganizationSchema extends Schema {
  up() {
    this.create('organizations', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.string('external_id', 255).notNullable()
      table
        .string('slug', 255)
        .notNullable()
        .unique()
      table.string('external_id').unique()
      table.string('api_token')

      table.timestamps()
    })
  }

  down() {
    this.drop('organizations')
  }
}

module.exports = OrganizationSchema
