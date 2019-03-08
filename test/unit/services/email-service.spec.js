'use strict'

const sinon = require('sinon')

const { test, beforeEach } = use('Test/Suite')('Email Service')

const EmailService = use('App/Services/EmailService')

const { UserFactory, TicketFactory, OrganizationFactory, MessageFactory } = models

let ticket1 = null
let user1 = null
let organization1 = null
let message1 = null
beforeEach(async () => {
  organization1 = await OrganizationFactory.create()
  user1 = await UserFactory.create()
  await user1.setRole('admin')
  await user1.setRole('owner')
  await organization1.users().save(user1)

  ticket1 = await TicketFactory.make()
  await ticket1.user().associate(user1)

  message1 = await MessageFactory.create({
    user_id: user1.id,
    ticket_id: ticket1.id
  })

  EmailService.sendEmail = sinon.fake()
})

test('Check sendReplyNotification sends proper subject and view', async ({ assert }) => {
  await EmailService.sendReplyNotification(ticket1)
  assert.isTrue(EmailService.sendEmail.called)
  assert.equal(EmailService.sendEmail.args[0][0], 'Tally Ticket Reply')
  assert.equal(EmailService.sendEmail.args[0][1], 'emails.reply-notification-email')
})

test('Check sendReplyNotification sends proper data', async ({ assert }) => {
  await EmailService.sendReplyNotification(ticket1)
  await message1.load('user')

  const data = {
    ...ticket1.toJSON(),
    user: { ...user1.toJSON(), organization: organization1.toJSON() },
    messages: [message1.toJSON()]
  }
  assert.isTrue(EmailService.sendEmail.called)
  assert.deepEqual(EmailService.sendEmail.args[0][2], data)
})

test('Check sendTicketConfirmation sends proper subject and view', async ({ assert }) => {
  await EmailService.sendTicketConfirmation(ticket1)
  assert.isTrue(EmailService.sendEmail.called)
  assert.equal(EmailService.sendEmail.args[0][0], 'Tally Ticket Confirmation')
  assert.equal(EmailService.sendEmail.args[0][1], 'emails.ticket-confirmation-email')
})

test('Check sendTicketConfirmation sends proper data', async ({ assert }) => {
  await EmailService.sendTicketConfirmation(ticket1)
  await message1.load('user')

  const data = {
    ...ticket1.toJSON(),
    user: { ...user1.toJSON(), organization: organization1.toJSON() },
    messages: [message1.toJSON()]
  }
  assert.isTrue(EmailService.sendEmail.called)
  assert.deepEqual(EmailService.sendEmail.args[0][2], data)
})

test('Check sendTokenToResetPassword sends proper subject and view', async ({ assert }) => {
  await EmailService.sendTokenToResetPassword(user1, 'token-testing')
  assert.isTrue(EmailService.sendEmail.called)
  assert.equal(EmailService.sendEmail.args[0][0], 'Tally Ticket - Recover Password')
  assert.equal(EmailService.sendEmail.args[0][1], 'emails.reset-password')
})

test('Check sendTokenToResetPassword sends proper data', async ({ assert }) => {
  await EmailService.sendTokenToResetPassword(user1, 'token-testing')
  await message1.load('user')

  const data = {
    user: user1,
    token: 'token-testing'
  }
  assert.isTrue(EmailService.sendEmail.called)
  assert.deepEqual(EmailService.sendEmail.args[0][2], data)
})
