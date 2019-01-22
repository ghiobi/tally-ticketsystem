'use strict'

const { test, before } = use('Test/Suite')('User Model')
const { User, Role, UserFactory, OrganizationFactory } = models

let organization = null

before(async () => {
  organization = await OrganizationFactory.create()
})

test('make sure a user can be initialized with an organization', async ({
  assert
}) => {
  await organization.users().save(
    await UserFactory.make({
      email: 'bob_marley@tally.com'
    })
  )

  const user = await User.query()
    .where('organization_id', organization.id)
    .where('email', 'bob_marley@tally.com')
    .first()

  assert.exists(user)
})

test('make sure a user cannot be initialized with a non unique email in an organization', async ({
  assert
}) => {
  await organization.users().save(
    await UserFactory.make({
      email: 'stephen.hawking@oxford.uk'
    })
  )

  let pass = true

  try {
    await organization.users().save(
      await UserFactory.make({
        email: 'stephen.hawking@oxford.uk'
      })
    )
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass)
})

test('make sure a user has a organization owner role', async ({ assert }) => {
  const user = await UserFactory.make()
  await organization.users().save(user)

  const role = await Role.query()
    .where('key', 'owner')
    .first()

  await user.roles().attach([role.id])

  const isOwner = await user.hasRole('owner')
  assert.isTrue(isOwner)
})

test('make sure a user can set an admin role', async ({ assert }) => {
  const user = await UserFactory.make()
  await organization.users().save(user)

  await user.setRole('admin')

  const isAdmin = await user.hasRole('admin')
  assert.isTrue(isAdmin)
})

test('make sure a regular user does not have a role', async ({ assert }) => {
  const user = await UserFactory.make()
  await organization.users().save(user)

  const isAdmin = await user.hasRole('admin')
  assert.isFalse(isAdmin)

  const isOwner = await user.hasRole('owner')
  assert.isFalse(isOwner)
})