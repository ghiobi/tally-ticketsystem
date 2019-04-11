'use strict'
const Expense = use('App/Models/Expense')
const { HttpException } = require('@adonisjs/generic-exceptions')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class ExpenseDetail {
  async handle({ auth, params }, next) {
    const expense = await Expense.query()
      .where('id', params['expense_id'])
      .with('user')
      .first()

    if (!expense) {
      throw new HttpException(null, 404)
    }

    if (!(await auth.user.hasRole('admin')) && auth.user.id !== expense.toJSON().user.id) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = ExpenseDetail
