'use strict'

const logger = use('App/Logger')
const currencyToSymbolMap = require('currency-symbol-map/map')
const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')
const ExpenseBusinessPurpose = use('App/Models/ExpenseBusinessPurpose')
const LineItemCategory = use('App/Models/LineItemCategory')
const LineItemRegion = use('App/Models/LineItemRegion')
const ForbiddenException = use('App/Exceptions/ForbiddenException')
const StatsD = require('../../../../config/statsd')

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

    let expense = ''
    try {
      expense = await Expense.query()
        .where('id', params.expense_id)
        .with('user')
        .with('expenseLineItems')
        .first()
    } catch (err) {
      logger.error(`Unable to get expense for expense: ${expense}. \n${err}`)
    }

    let expenseLineItems = ''
    try {
      expenseLineItems = await ExpenseLineItem.query()
        .where('expense_id', expense.id)
        .fetch()
    } catch (err) {
      logger.error(`Unable to get expense line items for expense: ${expense}. \n${err}`)
    }

    let lineItemsDict = {}
    expenseLineItems.rows.forEach((el) => (lineItemsDict[el.id] = el))

    if (!expense) {
      session.flash({ error: 'Error retrieving expense' })
      StatsD.increment('expense.update.failed')
      return response.redirect('back')
    }

    if (auth.user.id !== expense.user_id) {
      throw new ForbiddenException()
    }

    if (title !== expense.title) {
      try {
        await expense.updateTitle(title)
      } catch (err) {
        logger.error(`Unable to update expense title for expense: ${expense}. \n${err}`)
        StatsD.increment('expense.update.failed')
      }
    }

    if (expense.business_purpose !== business_purpose) {
      try {
        await expense.updateBusinessPurpose(business_purpose)
      } catch (err) {
        logger.error(`Unable to update expense business purpose for expense: ${expense}. \n${err}`)
        StatsD.increment('expense.update.failed')
      }
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
        StatsD.increment('expense.update.success')
      } else {
        try {
          await ExpenseLineItem.create({
            expense_id: expense.id,
            memo: memo[i],
            currency: currency[i],
            category: category[i],
            region: region[i],
            price: price[i],
            tax: tax[i]
          })
          StatsD.increment('expense.update.success')
        } catch (err) {
          logger.error(`Unable to create expense line item for expense: ${expense}. \n${err}`)
          StatsD.increment('expense.update.failed')
        }
      }
    }

    for (var key in lineItemsDict) {
      lineItemsDict[key].delete()
    }

    session.flash({ success: 'Your expense was updated.' })
    return response.redirect(`/organization/${request.organization.slug}/expense/${expense.id}`)
  }
}

module.exports = UpdateExpenseController
