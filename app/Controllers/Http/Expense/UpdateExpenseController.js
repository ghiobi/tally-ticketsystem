'use strict'

const currencyToSymbolMap = require('currency-symbol-map/map')

const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')
const ExpenseBusinessPurpose = use('App/Models/ExpenseBusinessPurpose')
const LineItemCategory = use('App/Models/LineItemCategory')
const LineItemRegion = use('App/Models/LineItemRegion')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class UpdateExpenseController {
  async index({ view, params }) {
    const expense = await Expense.query()
      .where('id', params.expense_id)
      .with('user')
      .with('expenseLineItems')
      .first()

    const expenseLineItems = await ExpenseLineItem.query()
      .where('expense_id', expense.id)
      .fetch()

    const businessPurposes = await ExpenseBusinessPurpose.all()
    const categories = await LineItemCategory.all()
    const regions = await LineItemRegion.all()
    return view.render('expense.update-expense', {
      businessPurposes: businessPurposes.toJSON(),
      categories: categories.toJSON(),
      regions: regions.toJSON(),
      currencyToSymbolMap,
      expense: expense.toJSON(),
      expenseLineItems: expenseLineItems.toJSON()
    })
  }

  async update({ request, response, auth, session, params }) {
    const { id, title, business_purpose, memo, category, currency, region, price, tax } = request.post()
    const expense = await Expense.query()
      .where('id', params.expense_id)
      .with('user')
      .with('expenseLineItems')
      .first()

    const expenseLineItems = await ExpenseLineItem.query()
      .where('expense_id', expense.id)
      .fetch()

    let lineItemsDict = {}
    expenseLineItems.rows.forEach((el) => (lineItemsDict[el.id] = el))

    if (!expense) {
      session.flash({ error: 'Error retrieving expense' })
      return response.redirect('back')
    }

    if (auth.user.id !== expense.user_id) {
      throw new ForbiddenException()
    }

    if (title !== expense.title) {
      await expense.updateTitle(title)
    }

    if (expense.business_purpose !== business_purpose) {
      await expense.updateBusinessPurpose(business_purpose)
    }

    for (var i = 0; i < id.length; i++) {
      if (id[i] in lineItemsDict) {
        let oldItem = lineItemsDict[id[i]]
        if (oldItem.memo !== memo[i]) {
          oldItem.updateMemo(memo[i])
        }
        if (oldItem.category !== category[i]) {
          oldItem.updateCategory(category[i])
        }
        if (oldItem.region !== region[i]) {
          oldItem.updateRegion(region[i])
        }
        if (oldItem.currency !== currency[i]) {
          oldItem.updateCurrency(currency[i])
        }
        if (oldItem.price !== price[i]) {
          oldItem.updatePrice(price[i])
        }
        if (oldItem.tax !== tax[i]) {
          oldItem.updateTax(tax[i])
        }
        delete lineItemsDict[id[i]]
      } else {
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
    }

    for (var key in lineItemsDict) {
      lineItemsDict[key].delete()
    }

    session.flash({ success: 'Your expense was updated.' })
    return response.redirect(`/organization/${request.organization.slug}/expense/${expense.id}`)
  }

  async delete({ response, params }) {
    const { expense_id } = params

    const expense = await Expense.find(expense_id)

    await expense.delete()

    response.redirect('back')
  }
}

module.exports = UpdateExpenseController
