'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Returns the belongs to organization orm relationship object.
   *
   * @returns {BelongsTo}
   */
  organization() {
    return this.belongsTo('App/Models/Organization')
  }

  /**
   * Returns the belongs to many role orm relationship object.
   *
   * @returns {BelongsToMany}
   */
  roles() {
    return this.belongsToMany('App/Models/Role')
  }

  /**
   * Checks if a user has a role by key.
   *
   * @param role The role key.
   * @returns {Promise<boolean>}
   */
  async hasRole(role) {
    const exists = await this.roles()
      .where('key', role)
      .first()

    return !!exists
  }
}

module.exports = User
