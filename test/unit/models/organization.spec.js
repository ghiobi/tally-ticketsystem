'use strict'

const { test } = use('Test/Suite')('Organization Model')

const Organization = use('App/Models/Organization')

test('make sure a model can be created', async ({ assert }) => {
  await Organization.create({
    name: 'Tally',
    slug: 'tally'
  })

  const tally = await Organization.query()
    .where('slug', 'tally')
    .first()

  assert.equal(tally.name, 'Tally')
})

test('make sure a model has a unique slug', async ({ assert }) => {
  await Organization.create({
    name: 'BestCompany',
    slug: 'best-company'
  })

  let pass = true

  try {
    await Organization.create({
      name: 'AwesomeBestCompany',
      slug: 'best-company'
    })
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'organizations should have unique slugs')
})
