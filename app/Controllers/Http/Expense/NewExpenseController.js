'use strict'

const currencyToSymbolMap = require('currency-symbol-map/map')

const Helpers = use('Helpers')
const Drive = use('Drive')

const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')
const ExpenseBusinessPurpose = use('App/Models/ExpenseBusinessPurpose')
const LineItemCategory = use('App/Models/LineItemCategory')
const LineItemRegion = use('App/Models/LineItemRegion')
const OcrService = use('App/Services/OcrService')
const ReceiptParserService = use('App/Services/ReceiptParserService')

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

  async scanReceipt({ view, request, auth, session }) {
    const businessPurposes = await ExpenseBusinessPurpose.all()
    const categories = await LineItemCategory.all()
    const regions = await LineItemRegion.all()
    const { title, business_purpose, memo, category, currency, region, price, tax } = request.post()

    //find which receipt number the image belongs to
    let receiptImage = null
    let receiptNumber = 0
    while (receiptImage === null) {
      receiptImage = request.file(`receipt[${receiptNumber}]`, {
        types: ['image']
      })
      if (receiptImage !== null) break
      receiptNumber++
    }

    //put uploaded file in /tmp/uploads
    const fileName = `${auth.user.id}${new Date().getTime()}` //userid + timestamp for uniqueness
    await receiptImage.move(Helpers.tmpPath('uploads'), {
      name: fileName,
      overwrite: true
    })
    if (!receiptImage.moved()) {
      return receiptImage.error()
    }

    //parse
    const parsedText = await OcrService.parseImage(`/uploads/${fileName}`)
    if (parsedText) {
      const receiptData = await ReceiptParserService.parse(parsedText)

      //replace with parsed data
      price[receiptNumber] = receiptData['total']
      currency[receiptNumber] = receiptData['currency']
      region[receiptNumber] = receiptData['region']
    }

    //set the fields that were already filled
    const expense_in_progress = { title: title, business_purpose: business_purpose }
    const receipts_in_progress = []
    for (var i = 0; i < memo.length; i++) {
      receipts_in_progress.push({
        memo: memo[i],
        category: category[i],
        currency: currency[i],
        region: region[i],
        price: price[i],
        tax: tax[i]
      })
    }

    //delete picture
    if (await Drive.exists(`uploads/${fileName}`)) {
      await Drive.delete(`uploads/${fileName}`)
    }

    session.flash({ success: 'Your receipt was parsed.' })

    return view.render('expense.new-expense', {
      businessPurposes: businessPurposes.toJSON(),
      categories: categories.toJSON(),
      regions: regions.toJSON(),
      currencyToSymbolMap,
      expense: expense_in_progress,
      expenseLineItems: receipts_in_progress
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
