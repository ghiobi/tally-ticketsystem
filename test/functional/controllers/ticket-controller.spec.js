'use strict'

const { test, trait, before } = use('Test/Suite')('Ticket Controller')
const { OrganizationFactory, UserFactory } = models
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user1 = null
let user2 = null
let ticket1 = null
let ticket2 = null
let ticket3 = null
let ticket4 = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'test'
  })

  user1 = await UserFactory.make()
  user2 = await UserFactory.make()

  await organization.users().save(user1)
  await organization.users().save(user2)

  ticket1 = await Factory.model('App/Models/Ticket').make()
  ticket2 = await Factory.model('App/Models/Ticket').make()
  ticket3 = await Factory.model('App/Models/Ticket').make()
  ticket4 = await Factory.model('App/Models/Ticket').make()

  await ticket1.user().associate(user1)
  await ticket2.user().associate(user1)
  await ticket3.user().associate(user2)
  await ticket4.user().associate(user2)
})

test('check that a users can retrieve their tickets', async ({
  client,
  assert
}) => {
  const response = await client
    .get(`/api/tickets/user/${user2.id}`)
    .loginVia(user2)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset([
    {
      id: ticket3.id,
      user_id: user2.id
    },
    {
      id: ticket4.id,
      user_id: user2.id
    }
  ])
})

test('check if all tickets from an organization can be retrieved', async ({
  client,
  assert
}) => {
  const userAdmin = await UserFactory.make()
  await organization.users().save(userAdmin)
  await userAdmin.setRole('admin')

  const response = await client
    .get(`/api/tickets/organization/${userAdmin.organization_id}`)
    .loginVia(userAdmin)
    .end()
  response.assertJSONSubset([
    {
      id: ticket1.id
    },
    {
      id: ticket2.id
    },
    {
      id: ticket3.id
    },
    {
      id: ticket4.id
    }
  ])
})
