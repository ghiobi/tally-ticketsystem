'use strict'

const sinon = require('sinon')
const chance = new (require('chance'))()

const { test } = use('Test/Suite')('Slack Service')
const { OrganizationFactory, UserFactory } = models

const SlackService = use('App/Services/SlackService')

test('make sure it finds a unique slug', async ({ assert }) => {
  const organization = await OrganizationFactory.create()

  const slug = await SlackService.findAvailableSlug(organization.slug)
  assert.equal(slug, `${organization.slug}-1`)

  await OrganizationFactory.create({
    slug: `${organization.slug}-1`
  })

  const nextAvailableSlug = await SlackService.findAvailableSlug(
    organization.slug
  )
  assert.equal(nextAvailableSlug, `${organization.slug}-2`)
})

test('make sure it can find organization with external id', async ({
  assert
}) => {
  const organization = await OrganizationFactory.create()

  const client = {
    auth: {
      test: sinon.fake.returns(Promise.resolve(true))
    }
  }
  const exists = await SlackService.findOrCreateOrganization(
    client,
    organization.external_id
  )

  assert.exists(exists)
  assert.isFalse(client.auth.test.called)
})

test('make sure it creates an organization if it cannot find one with the provided external id', async ({
  assert
}) => {
  const slug = chance.string()
  const name = chance.string()
  const external_id = chance.string() + 'SLACK'

  const client = {
    auth: {
      test: sinon.fake.returns(
        Promise.resolve({
          url: `https://${slug}.slack.com`,
          team: name
        })
      )
    }
  }

  const organization = await SlackService.findOrCreateOrganization(
    client,
    external_id
  )

  assert.exists(organization)
  assert.equal(organization.slug, slug)
  assert.equal(organization.name, name)
  assert.equal(organization.external_id, external_id)

  assert.isTrue(client.auth.test.called)
})

test('make sure it can find a user with an external id', async ({ assert }) => {
  const organization = await OrganizationFactory.create()

  const user = await UserFactory.create({
    organization_id: organization.id
  })

  const client = {
    users: {
      info: sinon.fake.returns(Promise.resolve({}))
    }
  }

  const exists = await SlackService.findOrCreateUser(
    client,
    organization,
    user.external_id
  )

  assert.exists(exists)
  assert.isFalse(client.users.info.called)
})

test('make sure it creates a regular user if it cannot find a user with an external id', async ({
  assert
}) => {
  await createFindOrCreateUserTest(assert, false, false)
})

test('make sure it creates an admin user if it cannot find a user with an external id', async ({
  assert
}) => {
  await createFindOrCreateUserTest(assert, true, false)
})

test('make sure it creates an owner user if it cannot find a user with an external id', async ({
  assert
}) => {
  await createFindOrCreateUserTest(assert, true, true)
})

const createFindOrCreateUserTest = async (assert, is_admin, is_owner) => {
  const organization = await OrganizationFactory.create()

  const name = chance.name()
  const email = chance.email()
  const external_id = chance.string() + 'SLACK'

  const client = {
    users: {
      info: sinon.fake.returns(
        Promise.resolve({
          user: {
            real_name: name,
            profile: { email },
            is_admin,
            is_owner
          }
        })
      )
    }
  }

  const user = await SlackService.findOrCreateUser(
    client,
    organization,
    external_id
  )

  assert.exists(user)

  assert.equal(user.external_id, external_id)
  assert.equal(user.name, name)
  assert.equal(user.email, email)
  assert.equal(await user.hasRole('admin'), is_admin)
  assert.equal(await user.hasRole('owner'), is_owner)

  assert.isTrue(client.users.info.called)
  assert.deepEqual(client.users.info.args[0][0], { user: external_id })
}
