'use strict'

const { test, beforeEach } = use('Test/Suite')('User Model')

const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Organization = use('App/Models/Organization')

let organization = null

beforeEach(async () => {
  organization = await Organization.findOrCreate({
    name: 'User Company',
    slug: 'user-company'
  })
})

test('make sure a user can be initialized with an organization', async ({
  assert
}) => {
  await organization.users().create({
    name: 'Bob Marley',
    email: 'bob_marley@tally.com',
    password: '411+9'
  })

  const user = await User.query()
    .where('organization_id', organization.id)
    .where('email', 'bob_marley@tally.com')
    .first()

  assert.isNotNull(user)
})

test('make sure a user cannot be initialized with a non unique email in an organization', async ({
  assert
}) => {
  await organization.users().create({
    name: 'Stephen Hawking',
    email: 'stephen.hawking@oxford.uk',
    password: '411+9'
  })

  let pass = true

  try {
    await organization.users().create({
      name: 'Stephen Hawking 2',
      email: 'stephen.hawking@oxford.uk',
      password: '411+9'
    })
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass)
})

test('make sure a user has a organization owner role', async ({ assert }) => {
  const user = await organization.users().create({
    name: 'John F. Kennedy',
    email: 'john.f.kennedy@usa.gov.com',
    password: '411+9'
  })

  const role = await Role.query()
    .where('key', 'owner')
    .first()
  await user.roles().attach([role.id])

  const isOwner = await user.hasRole('owner')
  assert.isTrue(isOwner)
})