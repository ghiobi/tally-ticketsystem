'use strict'

const currencyToSymbolMap = require('currency-symbol-map/map')

const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')
const ExpenseBusinessPurpose = use('App/Models/ExpenseBusinessPurpose')
const LineItemCategory = use('App/Models/LineItemCategory')
const LineItemRegion = use('App/Models/LineItemRegion')

class UpdateExpenseController {
  async index({ view, params }) {
    console.log(12345)
    const expense = await Expense.query()
      .where('id', params.expense_id)
      .with('user')
      .with('expenseLineItems')
      .first()

    const businessPurposes = await ExpenseBusinessPurpose.all()
    const categories = await LineItemCategory.all()
    const regions = await LineItemRegion.all()
    return view.render('expense.update-expense', {
      businessPurposes: businessPurposes.toJSON(),
      categories: categories.toJSON(),
      regions: regions.toJSON(),
      currencyToSymbolMap,
      expense: expense.toJSON()
    })
  }

  async update({ request, response, auth, session, params }) {
    const { title, business_purpose, memo, category, currency, region, price, tax } = request.post()
    const expense = await Expense.query()
      .where('id', params.expense_id)
      .with('user')
      .with('expenseLineItems')
      .first()

    if (!expense) {
      session.flash({ error: 'Error retrieving expense' })
      return response.redirect('back')
    }

    if (auth.user.id !== expense.user_id) {
      throw new ForbiddenException()
    }

    if (title != expense.title) {
      await expense.updateTitle(title)
    }

    if (expense.business_purpose != business_purpose) {
      await expense.updateBusinessPurpose(business_purpose)
    }

    for (var i = 0; i < memo.length; i++) {
      await ExpenseLineItem.create({
        expense_id: expense.id,
        memo: memo[i],
        currency: currency[i],
        category: category[i],
        region: region[i],
        price: price[i],
        tax: tax[i]
      })
    }
    session.flash({ success: 'Your expense was filed.' })
    return response.redirect(`/organization/${request.organization.slug}/expense/${expense.id}`)
  }
}

module.exports = UpdateExpenseController
