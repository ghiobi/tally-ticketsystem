'use strict'

const { test } = use('Test/Suite')('Role Model')

const Role = use('App/Models/Role')

test('make sure the roles models are seeded', async ({ assert }) => {
  const roles = await Role.all()

  assert.deepEqual(roles.toJSON(), [
    { id: 1, key: 'owner', display_name: 'Organization Owner' },
    { id: 2, key: 'admin', display_name: 'Organization Administrator' }
  ])
})
