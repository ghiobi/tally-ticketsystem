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
const ExpenseFactory = Factory.model('App/Models/Expense')
const ExpenseLineItemFactory = Factory.model('App/Models/ExpenseLineItem')
const ExpenseBusinessPurposeFactory = Factory.model('App/Models/ExpenseBusinessPurpose')
const LineItemCategoryFactory = Factory.model('App/Models/LineItemCategory')
const LineItemRegionFactory = Factory.model('App/Models/LineItemRegion')

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
    const owner = await UserFactory.create({
      email: 'owner@tally.com',
      name: 'Owner',
      password: 'password'
    })
    await organization.users().save(owner)
    await owner.setRole('owner')
    await owner.setRole('admin')

    const admin = await UserFactory.create({
      email: 'admin@tally.com',
      name: 'Administrator',
      password: 'password'
    })
    await organization.users().save(admin)
    await admin.setRole('admin')

    /**
     * Seed some expense business purposes
     */
    const purposes = ['Conference', 'General', 'Relocation', 'Team Building Events']

    for (const purpose in purposes) {
      await ExpenseBusinessPurposeFactory.create({ name: purposes[purpose] })
    }

    /**
      Seed some expenses
     */

    for (let i = 0; i < 50; i++) {
      const expense = await ExpenseFactory.create({
        title: chance.string({ length: 10 }),
        business_purpose: purposes[chance.integer({ min: 0, max: 3 })],
        user_id: chance.integer({ min: 1, max: 20 })
      })
      for (let j = 0; j < chance.integer({ min: 0, max: 10 }); j++) {
        await ExpenseLineItemFactory.create({
          expense_id: expense.id,
          memo: chance.sentence({ words: 3 }),
          currency: 'CAD',
          category: chance.word(),
          region: 'CAD-QC',
          text: chance.sentence({ words: 5 }),
          price: chance.floating({ min: 0, max: 100 }),
          tax: chance.floating({ min: 5.0, max: 15.0 })
        })
      }
    }

    /**
      Seed more users
     */
    await UserFactory.create({ email: 'user@tally.com', name: 'User', password: 'password' })
    await UserFactory.createMany(20)

    /**
      Seed some tickets
     */
    const tickets = []
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < chance.integer({ min: 0, max: 10 }); j++) {
        let assigned = chance.bool()
        tickets.push(
          await TicketFactory.create({
            user_id: chance.integer({ min: 3, max: 15 }),
            status: this.getStatus(assigned),
            assigned_to: assigned ? owner.id : null
          })
        )
      }
    }

    /**
     Seed some Messages
     */
    for (const ticket of tickets) {
      await MessageFactory.create({ ticket_id: ticket.id, user_id: ticket.user_id })
      for (let i = 0; i < chance.integer({ min: 0, max: 4 }); i++) {
        await MessageFactory.create({
          ticket_id: ticket.id,
          user_id: chance.bool() ? ticket.user_id : owner.id
        })
      }
    }

    /**
     * Seed some expense categories
     */
    const categories = [
      'Accomodations',
      'Cellphones and Wireless',
      'Conference Fees',
      'Consulting / Advisory Fees',
      'Contests Costs',
      'Courier Costs',
      'Courier and Postage',
      'Deposits',
      'Direct Computer Hardware',
      'Dicrect Computer Supplies',
      'Direct Recuitment Costs',
      'Direct Software and Licenses',
      'Employee Benefits',
      'Employee Functions',
      'Employee Merchandise',
      'Employee Recognition',
      'Events - Internal',
      'Kitchen/Washroom Supplies',
      'Meals and Entertainment',
      'Mileage',
      'Misc. Expenses',
      'Office Furnishing',
      'Office Supplies',
      'Professional Development',
      'Transportation',
      'Team Offiste Costs'
    ]

    for (const category in categories) {
      await LineItemCategoryFactory.create({ name: categories[category] })
    }

    /**
     * Seed some expense regions
     */
    const regions = { 'CAD-QC': 'Quebec', CAD: 'Canada (outside Quebec)', US: 'United States', Other: 'Other' }
    for (const region in regions) {
      await LineItemRegionFactory.create({ name: region, display: regions[region] })
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
