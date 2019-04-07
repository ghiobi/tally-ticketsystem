'use strict'

/// <reference types="Cypress" />

const Factory = use('Factory')

const OrganizationFactory = Factory.model('App/Models/Organization')
const UserFactory = Factory.model('App/Models/User')
const TicketFactory = Factory.model('App/Models/Ticket')
const MessageFactory = Factory.model('App/Models/Message')

describe('Submit Ticket Integration Test', () => {
  let organization = null
  let user = null
  let admin = null
  let adminTicket = null
  let userTicket = null

  beforeEach(() => {
    //to reset the state of the tests
    cy.visit('http://localhost:3333/')
  })

  before(async () => {
    organization = await OrganizationFactory.create({
      slug: 'e2e-test'
    })

    admin = await UserFactory.make({
      email: 'e2e-admin@email.com',
      password: 'adminpassword'
    })
    await organization.users().save(admin)
    await admin.setRole('admin')

    user = await UserFactory.make({
      email: 'e2e-user@email.com',
      password: 'userpassword'
    })
    await organization.users().save(user)

    adminTicket = await TicketFactory.make()
    await adminTicket.user().associate(admin)

    userTicket = await TicketFactory.make()
    await userTicket.user().associate(user)
  })

  it('User should reach submit ticket page when clicking on "Submit a Ticket" on dashboard view', () => {
    cy.userLogin(user.email, 'userpassword', organization.slug)
    cy.contains('Submit a Ticket').click()
    cy.location('pathname').should(
      'be',
      'http://localhost:3333/organization/tally/submit/ticket'
    )
  })
})
