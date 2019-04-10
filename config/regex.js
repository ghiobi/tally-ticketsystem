'use strict'

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Total
  |--------------------------------------------------------------------------
  |
  | Matches monetary amount eg 12.99.
  |
  */
  total: /((?<=^)|(?<=[^0-9\-/.,:]))((\d{1,3}(,[ \t]?\d{3})*\.[ \t]?\d{2})|(\d{1,3}(\.[ \t]?\d{3})*,[ \t]?\d{2})|(\d{1,3}([ \t]?\d{3})*\.[ \t]?\d{2})|(\d{1,3}([ \t]?\d{3})*,[ \t]?\d{2}))((?=$)|(?=[^0-9\-/.,:]))/gi,

  /*
  |--------------------------------------------------------------------------
  | Location
  |--------------------------------------------------------------------------
  |
  | Matches patterns that could relate to location information
  |
  */
  location: {
    quebec: {
      tax: /(^|\W)(T\.?\s?P\.?\s?S|T\.?\s?V\.?\s?Q|Q\.?\s?S\.?\s?T)(\W|$)/i,
      location: /((\s|^)(Quebec)(\s|^|,))|((QC|QUEBEC)\s([A-Z][0-9][A-Z](\s?|-)?[0-9][(A-Z)|(0-9)][0-9]))/i
    },
    canada: {
      tax: /(^|\W)(H\.?\s?S\.?\s?T|P\.?\s?S\.?\s?T|G\.?\s?S\.?\s?T)(\W|$)/i,
      location: /((\s|^)(Alberta|British Columbia|Manitoba|New Brunswick|Newfoundland|Northwest Territories|Nova Scotia|Nunavut|Ontario|Prince Edward Island|Saskatchewan|Yukon)(\s|^|,))|((AB|BC|MB|NB|NL|NT|NS|NU|ON|PE|SK|YT)\s([A-Z][0-9][A-Z](\s?|-)?[0-9][(A-Z)|(0-9)][0-9]))/i
    },
    us: /(\s|^)(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\s\d{5}/i
  },

  /*
  |--------------------------------------------------------------------------
  | Currency
  |--------------------------------------------------------------------------
  |
  | Matches patterns that could relate to location information
  |
  */
  currency: {
    CAD: /(\s|^)(CAD\s?\$?|CA\s?\$)/,
    USD: /(\s|^)(USD\s?\$?|US\s?\$)/,
    GBP: /(\s|^)GBP|£|₤/,
    EUR: /(\s|^)EUR|Euro|EURO|€/,
    INR: /(\s|^)INR|₹/
  }
}
