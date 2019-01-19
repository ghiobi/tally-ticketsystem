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
const Hash = use('Hash')

Factory.blueprint('App/Models/User', (faker, i, data) => {
  return {
    name: faker.name(),
    email: faker.email(),
    ...data,
    password: Hash.make(data.password ? data.password : faker.string())
  }
})

Factory.blueprint('App/Models/Organization', (faker, i, data) => {
  return {
    name: faker.sentence({ words: 3 }),
    slug: faker.word({ length: faker.integer({ min: 5, max: 30 }) }),
    ...data
  }
})

