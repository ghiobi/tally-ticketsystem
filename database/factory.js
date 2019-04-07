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
    external_id: faker.string(),
    name: faker.name(),
    email: faker.email(),
    password: faker.string(),
    external_access_token: faker.string(),
    organization_id: 1,
    ...data
  }
})

Factory.blueprint('App/Models/Organization', (faker, i, data) => {
  return {
    external_id: faker.string(),
    api_token: faker.string({ length: 255 }),
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

Factory.blueprint('App/Models/Token', (faker, i, data) => {
  return { token: faker.string({ length: 32 }), type: 'test', ...data }
})

Factory.blueprint('App/Models/Notification', (faker, i, data) => {
  return {
    user_id: 1,
    data: null,
    type: 'message',
    read: faker.bool(),
    ...data
  }
})

Factory.blueprint('App/Models/Expense', (faker, i, data) => {
  return {
    title: faker.string(),
    business_purpose: 'Transportation',
    ...data
  }
})

Factory.blueprint('App/Models/ExpenseLineItem', (faker, i, data) => {
  return {
    memo: faker.string(),
    text: faker.string(),
    ...data
  }
})

Factory.blueprint('App/Models/ExpenseBusinessPurpose', (faker, i, data) => {
  return {
    name: faker.string(),
    ...data
  }
})

Factory.blueprint('App/Models/LineItemCategory', (faker, i, data) => {
  return {
    name: faker.string(),
    ...data
  }
})

Factory.blueprint('App/Models/LineItemRegion', (faker, i, data) => {
  return {
    name: faker.string(),
    display: faker.string(),
    ...data
  }
})
