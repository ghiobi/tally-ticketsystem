'use strict'

const { test, trait, before } = use('Test/Suite')('Api Ticket Service')
const { OrganizationFactory, UserFactory, TicketFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user1 = null
let user2 = null
let userAdmin = null
let ticket1 = null
let ticket2 = null
let ticket3 = null
let ticket4 = null
let wrongOrganization = 'wrongOrganization'

before(async () => {
  organization = await OrganizationFactory.create({
    api_token: 'someRandomAPIToken'
  })

  user1 = await UserFactory.make()
  user2 = await UserFactory.make()
  userAdmin = await UserFactory.make()

  await organization.users().save(user1)
  await organization.users().save(user2)
  await organization.users().save(userAdmin)

  await userAdmin.setRole('admin')

  ticket1 = await TicketFactory.make()
  ticket2 = await TicketFactory.make()
  ticket3 = await TicketFactory.make()
  ticket4 = await TicketFactory.make()

  await ticket1.user().associate(user1)
  await ticket2.user().associate(user1)
  await ticket3.user().associate(user2)
  await ticket4.user().associate(user2)
})

test('check if all tickets from an organization can be retrieved', async ({
  client
}) => {
  const response = await client
    .get(
      `/organization/${organization.slug}/api/tickets?token=${
        organization.api_token
      }`
    )
    .loginVia(userAdmin)
    .end()

  response.assertStatus(200)
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

test('check that tickets belonging to a user can be retrieved', async ({
  client
}) => {
  const response = await client
    .get(
      `organization/${organization.slug}/api/tickets/user/${user2.id}?token=${
        organization.api_token
      }`
    )
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

test('check that a wrong token prevents from retrieving all tickets', async ({
  client
}) => {
  const response = await client
    .get(
      `/organization/${
        organization.slug
      }/api/tickets?token=${wrongOrganization}`
    )
    .end()

  response.assertStatus(403)
})

test('check that a wrong token prevents from retrieving tickets belonging to a user', async ({
  client
}) => {
  const response = await client
    .get(
      `organization/${organization.slug}/api/tickets/user/${
        user2.id
      }?token=${wrongOrganization}`
    )
    .end()

  response.assertStatus(403)
})
