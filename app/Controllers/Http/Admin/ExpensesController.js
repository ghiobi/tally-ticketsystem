'use strict'

const Expense = use('App/Models/Expense')

class ExpensesController {
  async index({ view }) {
    let expenses = await Expense.all()
    // Do calculation here
    expenses = expenses.toJSON()
    let businessPurposeCount = {}

    for (const i in expenses) {
      if (businessPurposeCount[expenses[i].business_purpose]) {
        businessPurposeCount[expenses[i].business_purpose] += 1
      } else {
        businessPurposeCount[expenses[i].business_purpose] = 1
      }
    }

    return view.render('admin.expenses', {
      expenses: {
        data: expenses
      },
      piedata: encodeURIComponent(JSON.stringify(businessPurposeCount))
    })
  }
}

module.exports = ExpensesController
