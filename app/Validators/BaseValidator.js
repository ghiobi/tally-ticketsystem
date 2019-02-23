'use strict'

class BaseValidator {
  async fails(errorMessages) {
    const { request, response, session } = this.ctx

    /**
     *  If testing with Postman set headers X-Requested-With to XMLHttpRequest
     *  or request won't be identified as AJAX.
     */
    if (request.ajax()) {
      return response.status(400).send({
        okay: false,
        errors: errorMessages
      })
    }

    session.withErrors(errorMessages).flashAll()
    return response.status(400).redirect('back')
  }
}

module.exports = BaseValidator
