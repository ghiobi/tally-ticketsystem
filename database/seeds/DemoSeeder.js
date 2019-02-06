'use strict'

const chance = new (require('chance'))()

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

const OrganizationFactory = Factory.model('App/Models/Organization')
const UserFactory = Factory.model('App/Models/User')
const TicketFactory = Factory.model('App/Models/Ticket')
const MessageFactory = Factory.model('App/Models/Message')

class DemoSeeder {
  async run() {
    /**
     Seed the roles
     */
    await Role.createMany([
      { key: 'owner', display_name: 'Organization Owner' },
      { key: 'admin', display_name: 'Organization Administrator' }
    ])

    const organization = await OrganizationFactory.create({
      name: 'Tally Inc.',
      slug: 'tally'
    })

    /**
      Seed an admin/owner
     */
    const admin = await UserFactory.create({
      email: 'owner@tally.com',
      name: 'Owner ',
      password: 'password'
    })
    await organization.users().save(admin)
    await admin.setRole('owner')
    await admin.setRole('admin')

    /**
      Seed more users
     */
    await UserFactory.create({
      email: 'user@tally.com',
      name: 'User',
      password: 'password'
    })
    await UserFactory.createMany(13)

    /**
      Seed some tickets
     */
    const tickets = []
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < chance.integer({ min: 0, max: 10 }); j++) {
        let assigned = chance.bool()
        tickets.push(
          await TicketFactory.create({
            user_id: chance.integer({ min: 2, max: 15 }),
            status: this.getStatus(assigned),
            assigned_to: assigned ? admin.id : null
          })
        )
      }
    }

    /**
     Seed some Messages
     */
    for (const ticket of tickets) {
      await MessageFactory.create({
        ticket_id: ticket.id,
        user_id: ticket.user_id
      })
      for (let i = 0; i < chance.integer({ min: 0, max: 4 }); i++) {
        await MessageFactory.create({
          ticket_id: ticket.id,
          user_id: chance.bool() ? ticket.user_id : admin.id
        })
      }
    }
  }

  getStatus(assigned) {
    if (assigned) {
      return 'replied'
    }
    switch (chance.integer({ min: 0, max: 1 })) {
      case 0:
        return 'submitted'
      case 1:
        return 'closed'
    }
  }
}

module.exports = DemoSeeder
