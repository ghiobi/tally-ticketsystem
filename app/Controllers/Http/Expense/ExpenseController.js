'use strict'

const Expense = use('App/Models/Expense')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class ExpenseController {
  async index({ view, request, auth }) {
    const search_keyword = request.only('search').search
    let expenses = null
    let searching = false

    if (search_keyword && search_keyword !== '') {
      searching = true
      expenses = await auth.user
        .expenses()
        .whereRaw(`"title" LIKE '%${search_keyword}%'`)
        .with('user')
        .paginate(request.input('page', 1))
    } else {
      expenses = await auth.user
        .expenses()
        .with('user')
        .paginate(request.input('page', 1))
    }

    const paginateUrl = '/expense?'

    return view.render('expense.main', { expenses: expenses.toJSON(), paginateUrl, searching: searching })
  }

  async viewExpense({ view, params }) {
    const expense = await Expense.query()
      .where('id', params.expense_id)
      .with('user')
      .with('expenseLineItems')
      .first()

    return view.render('expense.expense', { expense: expense.toJSON() })
  }

  async deleteExpense({ request, response, auth, session }) {
    const expense_id = request.input('modal_data')
    const expense = await Expense.find(expense_id)
    if (!expense) {
      session.flash({ error: 'expense was no longer found' })
      return response.redirect('back')
    }

    if (auth.user.id !== expense.user_id) {
      throw new ForbiddenException()
    }
    await expense.delete()
    return response.redirect('back')
  }
}

module.exports = ExpenseController
