const Factory = use('Factory')

const MODEL_DIR = 'App/Models/'

const ORGANIZATION_MODEL = MODEL_DIR + 'Organization'
const USER_MODEL = MODEL_DIR + 'User'
const ROLE_MODEL = MODEL_DIR + 'Role'
const TICKET_MODEL = MODEL_DIR + 'Ticket'
const MESSAGE_MODEL = MODEL_DIR + 'Message'
const TOKEN_MODEL = MODEL_DIR + 'Token'

module.exports = {
  Organization: use(ORGANIZATION_MODEL),
  OrganizationFactory: Factory.model(ORGANIZATION_MODEL),

  User: use(USER_MODEL),
  UserFactory: Factory.model(USER_MODEL),

  Ticket: use(TICKET_MODEL),
  TicketFactory: Factory.model(TICKET_MODEL),

  Message: use(MESSAGE_MODEL),
  MessageFactory: Factory.model(MESSAGE_MODEL),

  Role: use(ROLE_MODEL),

  Token: use(TOKEN_MODEL),
  TokenFactory: Factory.model(TOKEN_MODEL)
}
