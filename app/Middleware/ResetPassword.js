'use strict'
const Token = use('App/Models/Token')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class ResetPassword {
  async handle({ request }, next) {
    let token = request.input('token')
    if (!token) {
      // TODO: throw a more appropriate error
      throw new ForbiddenException()
    }
    token = decodeURIComponent(token)

    const token_in_db = await Token.query()
      .where('token', '=', token)
      .fetch()

    if (!token_in_db.toJSON().length > 0) {
      // token doesn't exist
      throw new ForbiddenException()
    }
    await next()
  }
}

module.exports = ResetPassword
