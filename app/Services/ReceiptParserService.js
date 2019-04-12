const Config = use('Config')
const regex = Config.get('regex')

class ReceiptParserService {
  async parse(receipt_text) {
    return {
      total: this.total(receipt_text),
      ...this.currencyAndRegion(receipt_text),
      text: receipt_text
    }
  }

  total(receipt_text) {
    let matches = receipt_text.match(regex['total'])
    matches.forEach(function(match, i) {
      matches[i] = parseFloat(match)
    })
    return Math.max(...matches).toFixed(2)
  }

  currencyAndRegion(receipt_text) {
    const currency_map = {
      CAD: 'CAN-QC',
      USD: 'US',
      GBP: 'other',
      EUR: 'other',
      INR: 'other',
      SEK: 'other'
    }
    const location_map = {
      'CAN-QC': 'CAD',
      CAN: 'CAD',
      US: 'USD'
    }
    let currency = this.currency(receipt_text)
    let region = this.region(receipt_text)
    if (currency !== null && region !== null && location_map[currency] !== region) {
      currency = location_map[region]
    } else if (currency !== null && region === null) {
      region = currency_map[currency]
    } else if (currency === null && region !== null) {
      currency = location_map[region]
    } else {
      currency = 'CAD'
      region = 'CAN-QC'
    }

    return { currency: currency, region: region }
  }

  currency(receipt_text) {
    const currencies = regex['currency']
    for (var currency in currencies) {
      if (currencies[currency].test(receipt_text)) {
        return currency
      }
    }
    return null
  }

  region(receipt_text) {
    if (this.fromQuebec(receipt_text)) return 'CAN-QC'
    if (this.fromCanada(receipt_text)) return 'CAN'
    if (this.fromUS(receipt_text)) return 'US'
    return null
  }

  fromQuebec(receipt_text) {
    return (
      regex['location']['quebec']['tax'].test(receipt_text) ||
      regex['location']['quebec']['location'].test(receipt_text)
    )
  }

  fromCanada(receipt_text) {
    return (
      regex['location']['canada']['tax'].test(receipt_text) ||
      regex['location']['canada']['location'].test(receipt_text)
    )
  }

  fromUS(receipt_text) {
    return regex['location']['us'].test(receipt_text)
  }
}
module.exports = ReceiptParserService
