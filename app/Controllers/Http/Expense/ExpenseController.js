'use strict'

const Expense = use('App/Models/Expense')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class ExpenseController {
  async index({ view, request, auth }) {
    const expenses = await auth.user
      .expenses()
      .with('user')
      .paginate(request.input('page', 1))

    return view.render('expense.main', { expenses: expenses.toJSON() })
  }

  async viewExpense({ view, params }) {
    const expense = await Expense.query()
      .where('id', params.expense_id)
      .with('user')
      .with('expenseLineItems')
      .first()

    return view.render('expense.expense', { expense: expense.toJSON() })
  }

  async deleteExpense({ request, response, auth }) {
    const expense_id = request.input('form_data')
    const expense = await Expense.query()
      .where('id', expense_id)
      .first()

    if (auth.user.id !== expense.user_id) {
      console.log('error')
      throw new ForbiddenException()
    }
    await expense.delete()
    console.log('redirect')
    return response.redirect('back')
  }
}

module.exports = ExpenseController
