'use strict'

const Expense = use('App/Models/Expense')

class ExpenseController {
  async index({ view, request, auth }) {
    const expenses = await auth.user
      .expenses()
      .with('user')
      .paginate(request.input('page', 1))

    return view.render('expense.main', { expenses: expenses.toJSON() })
  }

  async viewExpense({ view, params }) {
    const expense = await Expense.find(params.expense_id)

    return view.render('expense.main', { expenses: expense.toJSON() })
  }
}

module.exports = ExpenseController
