'use strict'

const { test } = use('Test/Suite')('Organization Model')
const { Organization, OrganizationFactory, TicketFactory, UserFactory } = models

test('make sure a model can be created', async ({ assert }) => {
  await OrganizationFactory.create({
    slug: 'tally2'
  })

  const tally = await Organization.query()
    .where('slug', 'tally2')
    .first()

  assert.isNotNull(tally)
})

test('make sure a model has a unique slug', async ({ assert }) => {
  await OrganizationFactory.create({
    slug: 'best-company'
  })

  let pass = true

  try {
    await OrganizationFactory.create({
      slug: 'best-company'
    })
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'organizations should have unique slugs')
})

test('make sure a user can be initialized and found with an organization', async ({
  assert
}) => {
  let organization = await OrganizationFactory.create()

  await organization.users().save(
    await UserFactory.make({
      email: 'user.oranization.service@email.com'
    })
  )

  const user = await organization.findUserByEmail(
    'user.oranization.service@email.com'
  )

  assert.exists(user)
  assert.equal(user.email, 'user.oranization.service@email.com')
})

test('make sure an organization can get its tickets', async ({ assert }) => {
  let organization = await OrganizationFactory.create()

  const user = await UserFactory.create({
    organization_id: organization.id
  })

  const user2 = await UserFactory.create({
    organization_id: organization.id
  })

  await TicketFactory.createMany(7, { user_id: user.id })
  await TicketFactory.createMany(3, { user_id: user2.id })

  const tickets = await organization.tickets().fetch()
  assert.equal(tickets.size(), 10)
})
