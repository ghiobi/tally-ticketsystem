'use strict'

const currencyToSymbolMap = require('currency-symbol-map/map')

const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')
const ExpenseBusinessPurpose = use('App/Models/ExpenseBusinessPurpose')
const LineItemCategory = use('App/Models/LineItemCategory')
const LineItemRegion = use('App/Models/LineItemRegion')

class NewExpenseController {
  async index({ view }) {
    const businessPurposes = await ExpenseBusinessPurpose.all()
    const categories = await LineItemCategory.all()
    const regions = await LineItemRegion.all()
    return view.render('expense.new-expense', {
      businessPurposes: businessPurposes.toJSON(),
      categories: categories.toJSON(),
      regions: regions.toJSON(),
      currencyToSymbolMap
    })
  }

  async submit({ request, response, auth, session }) {
    const { title, business_purpose, memo, category, currency, region, price, tax } = request.post()
    const user = auth.user
    const expense = await Expense.create({ title: title, business_purpose: business_purpose, user_id: user.id })

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

module.exports = NewExpenseController
