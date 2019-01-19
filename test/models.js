const Factory = use('Factory')

const MODEL_DIR = 'App/Models/'

const ORGANIZATION_MODEL = MODEL_DIR + 'Organization'
const USER_MODEL = MODEL_DIR + 'User'
const ROLE_MODEL = MODEL_DIR + 'Role'

module.exports = {
  Organization: use(ORGANIZATION_MODEL),
  OrganizationFactory: Factory.model(ORGANIZATION_MODEL),

  User: use(USER_MODEL),
  UserFactory: Factory.model(USER_MODEL),

  Role: use(ROLE_MODEL)
}
