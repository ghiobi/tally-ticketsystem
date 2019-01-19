'use strict'

const { test, trait } = use('Test/Suite')('Organization Model')
const { Organization, OrganizationFactory } = models

trait('DatabaseTransactions')

test('make sure a model can be created', async ({ assert }) => {
  await OrganizationFactory.create({
      slug: 'tally'
  })

  const tally = await Organization.query()
    .where('slug', 'tally')
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
