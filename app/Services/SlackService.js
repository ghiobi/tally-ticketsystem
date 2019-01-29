const chance = new (require('chance'))()
const Organization = use('App/Models/Organization')
const User = use('App/Models/User')

const SLACK_PROTOCOL = 'https://'
const SLACK_DOMAIN = '.slack.com'

/**
 *  Takes care managing data from slack along with interacting with app models.
 */
class SlackService {
  /**
   *
   * @param client The web client for slack APIs.
   * @param user_id The external user id from slack.
   * @param team_id The external team id from slack.
   * @returns {Promise<*>}
   */
  async authenticate(client, user_id, team_id) {
    const organization = await this.findOrCreateOrganization(client, team_id)

    return this.findOrCreateUser(client, organization, user_id)
  }

  /**
   * Creates or finds a user within an organization.
   *
   * @param client The web client for slack APIs.
   * @param organization
   * @param user_id The external user id from slack.
   * @returns {Promise<User>}
   */
  async findOrCreateUser(client, organization, user_id) {
    let user = await User.query()
      .where('external_id', user_id)
      .first()

    if (user) {
      return user
    }

    // From https://api.slack.com/methods/users.info
    const {
      user: {
        real_name,
        profile: { email },
        is_admin,
        is_owner
      }
    } = await client.users.info({
      user: user_id
    })

    user = await User.create({
      name: real_name,
      email,
      external_id: user_id,
      organization_id: organization.id,
      external_access_token: client.token,
      password: chance.string({ length: 20 })
    })

    if (is_admin) {
      await user.setRole('admin')
    }

    if (is_owner) {
      await user.setRole('owner')
    }

    return user
  }

  /**
   * Creates or finds an organization.
   *
   * @param client The web client for slack APIs.
   * @param team_id The external team id from slack.
   * @returns {Promise<*>}
   */
  async findOrCreateOrganization(client, team_id) {
    let organization = await Organization.query()
      .where('external_id', team_id)
      .first()

    if (organization) {
      return organization
    }

    // From https://api.slack.com/methods/auth.test
    const { url, team } = await client.auth.test()

    const slug = await this.findAvailableSlug(
      url.substring(
        url.indexOf(SLACK_PROTOCOL) + SLACK_PROTOCOL.length,
        url.indexOf(SLACK_DOMAIN)
      )
    )

    organization = await Organization.create({
      slug,
      name: team,
      external_id: team_id
    })

    return organization
  }

  /**
   * Queries the database to check if slug is available. If slug is not available, a number appends to the end, and
   * checks again until a unique slug can be found.
   *
   * @param slug
   * @returns {Promise<String>} The available slug.
   */
  async findAvailableSlug(slug) {
    let iteration = 0
    let name = slug
    let exists = null

    do {
      if (iteration > 0) {
        name = `${slug}-${iteration}`
      }

      exists = await Organization.query()
        .where('slug', name)
        .first()

      iteration++
    } while (exists)

    return name
  }
}

module.exports = SlackService
