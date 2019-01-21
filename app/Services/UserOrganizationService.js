class UserOrganizationService {
  /**
   * Finds a user within an organization.
   *
   * @param organization
   * @param email
   * @returns {*}
   */
  findByEmail(organization, email) {
    return organization
      .users()
      .where('email', email)
      .first()
  }
}

module.exports = UserOrganizationService
