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
    const expense = await Expense.query()
      .where('id', params.expense_id)
      .with('user')
      .with('expenseLineItems')
      .first()

    console.log(expense.toJSON())
    return view.render('expense.expense', { expense: expense.toJSON() })
  }
}

module.exports = ExpenseController
