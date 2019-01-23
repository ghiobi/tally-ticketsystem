'use strict'

/*
|--------------------------------------------------------------------------
| FakeOrganizationrSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Role = use('App/Models/Role')
const Factory = use('Factory')

class DemoSeeder {
  async run() {
    const organization = await Factory.model('App/Models/Organization').create({
      name: 'Tally Inc.',
      slug: 'tally'
    })
    /**
      Seed the roles
     */
    await Role.createMany([
      { key: 'owner', display_name: 'Organization Owner' },
      { key: 'admin', display_name: 'Organization Administrator' },
      { key: 'user', display_name: 'User' }
    ])
    /**
      Seed an admin/owner
     */
    const user = await Factory.model('App/Models/User').create({
      email: 'owner@tally.com',
      name: 'Owner',
      password: 'password'
    })
    await organization.users().save(user)
    await user.setRole('owner')
    await user.setRole('admin')

    /**
      Seed more users
     */
    const user2 = await Factory.model('App/Models/User').create({
      email: 'user@tally.com',
      name: 'user',
      password: 'nimda'
    })
    const user3 = await Factory.model('App/Models/User').create()
    await user2.setRole('user')
    await user3.setRole('user')

    /**
      Seed some tickets
     */
    const ticket = await Factory.model('App/Models/Ticket').make()
    await ticket.user().associate(user)
    await ticket.organization().associate(organization)

    const ticket2 = await Factory.model('App/Models/Ticket').make()
    await ticket2.user().associate(user2)
    await ticket2.organization().associate(organization)

    const ticket3 = await Factory.model('App/Models/Ticket').make({
      status: 'replied'
    })
    await ticket3.user().associate(user3)
    await ticket3.organization().associate(organization)

    const ticket4 = await Factory.model('App/Models/Ticket').make({
      status: 'replied'
    })
    await ticket4.user().associate(user2)
    await ticket4.organization().associate(organization)

    const ticket5 = await Factory.model('App/Models/Ticket').make({
      status: 'replied'
    })
    await ticket5.user().associate(user2)
    await ticket5.organization().associate(organization)

    const ticket6 = await Factory.model('App/Models/Ticket').make({
      status: 'replied'
    })
    await ticket6.user().associate(user3)
    await ticket6.organization().associate(organization)

    const ticket7 = await Factory.model('App/Models/Ticket').make({
      status: 'replied'
    })
    await ticket7.user().associate(user3)
    await ticket7.organization().associate(organization)

    const ticket8 = await Factory.model('App/Models/Ticket').make({
      status: 'closed'
    })
    await ticket8.user().associate(user)
    await ticket8.organization().associate(organization)

    /**
      Seed some messages to ticket
     */
    await Factory.model('App/Models/Message').create({
      user_id: user.id,
      ticket_id: ticket.id
    })

    await Factory.model('App/Models/Message').create({
      user_id: user2.id,
      ticket_id: ticket.id
    })

    await Factory.model('App/Models/Message').create({
      user_id: user3.id,
      ticket_id: ticket.id
    })

    await Factory.model('App/Models/Message').create({
      user_id: user.id,
      ticket_id: ticket.id
    })
  }
}

module.exports = DemoSeeder
