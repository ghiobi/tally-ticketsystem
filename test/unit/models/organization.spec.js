'use strict'

const { test } = use('Test/Suite')('Organization Model')
const { Organization, OrganizationFactory } = models

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
