'use strict'

const { test } = use('Test/Suite')('Receipt Parser Service')

const ReceiptParserService = use('App/Services/ReceiptParserService')

test('make sure that the highest total amount is returned', async ({ assert }) => {
  let testString = '1.11 111.11 1111.11 11.11'
  let result = ReceiptParserService.total(testString)
  assert.equal(result, '1111.11')
})

test('make sure that a quebec location can be found', async ({ assert }) => {
  let testString = 'aaa bbb quebec ccc'
  let result = ReceiptParserService.fromQuebec(testString)
  assert.isTrue(result)

  testString = 'aaa bbb TVQ ccc'
  result = ReceiptParserService.fromQuebec(testString)
  assert.isTrue(result)

  testString = 'aaa bbb ccc'
  result = ReceiptParserService.fromQuebec(testString)
  assert.isFalse(result)
})

test('make sure that a canada location can be found', async ({ assert }) => {
  let testString = 'aaa bbb ontario ccc'
  let result = ReceiptParserService.fromCanada(testString)
  assert.isTrue(result)

  testString = 'aaa bbb GST ccc'
  result = ReceiptParserService.fromCanada(testString)
  assert.isTrue(result)

  testString = 'aaa bbb ccc'
  result = ReceiptParserService.fromCanada(testString)
  assert.isFalse(result)
})

test('make sure that a US location can be found', async ({ assert }) => {
  let testString = 'aaa bbb NY 12345 ccc'
  let result = ReceiptParserService.fromUS(testString)
  assert.isTrue(result)

  testString = 'aaa bbb ccc'
  result = ReceiptParserService.fromUS(testString)
  assert.isFalse(result)
})

test('make sure that a currency can be found', async ({ assert }) => {
  let testString = 'aaa bbb CAD ccc'
  let result = ReceiptParserService.currency(testString)
  assert.equal(result, 'CAD')

  testString = 'aaa bbb ccc'
  result = ReceiptParserService.currency(testString)
  assert.isNull(result)
})

test('make sure that location-region mapping works', async ({ assert }) => {
  let testString = 'aaa bbb USD ccc'
  let result = ReceiptParserService.currencyAndRegion(testString)
  assert.deepEqual(result, { currency: 'USD', region: 'US' })

  testString = 'aaa bbb NY 12345 ccc'
  result = ReceiptParserService.currencyAndRegion(testString)
  assert.deepEqual(result, { currency: 'USD', region: 'US' })

  testString = 'aaa USD bbb quebec ccc'
  result = ReceiptParserService.currencyAndRegion(testString)
  assert.deepEqual(result, { currency: 'CAD', region: 'CAN-QC' })

  testString = 'aaa bbb ccc'
  result = ReceiptParserService.currencyAndRegion(testString)
  assert.deepEqual(result, { currency: 'CAD', region: 'CAN-QC' })
})
