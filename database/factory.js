'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker, i, data) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: faker.string(),
    organization_id: 1,
    ...data
  }
})

Factory.blueprint('App/Models/Organization', (faker, i, data) => {
  return {
    name: faker.sentence({ words: 3 }),
    slug: faker.word({ length: faker.integer({ min: 5, max: 30 }) }),
    ...data
  }
})

Factory.blueprint('App/Models/Ticket', (faker, i, data) => {
  return {
    title: faker.sentence({ words: 5 }),
    status: 'submitted',
    ...data
  }
})

Factory.blueprint('App/Models/Message', (faker, i, data) => {
  return {
    body: faker.paragraph(),
    ...data
  }
})
