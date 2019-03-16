'use strict'

const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')

class NewExpenseController {
  async index({ view }) {
    return view.render('expense.new-expense')
  }

  async submit({ request, response, auth }) {
    const { title, business_purpose, memo, category, currency, region, price, tax } = request.post()
    const user = auth.user
    const expense = await Expense.create({ title: title, business_purpose: business_purpose, user_id: user.id })
    // var expense = {title: title, business_purpose:business_purpose, user_id:user.id}
    // var receipt = {memo: memo, currency: currency, region: region, price: price, tax: tax}
    // console.log(expense)
    // console.log(receipt)

    for (var i = 0; i < memo.length; i++) {
      var expenseLineItem = await ExpenseLineItem.create({
        expense_id: expense.id,
        memo: memo[i],
        currency: currency[i],
        category: category[i],
        region: region[i],
        price: price[i],
        tax: tax[i]
      })
    }

    return response.redirect('back')
  }
}

module.exports = NewExpenseController
