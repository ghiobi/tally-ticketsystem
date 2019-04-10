var Tesseract = require('tesseract.js')
const Helpers = use('Helpers')

class OcrService {
  async parseImage(imagePath) {
    var image = Helpers.tmpPath(imagePath)
    var text = null
    await Tesseract.recognize(image)
      .catch((err) => console.error(err))
      .then(function(result) {
        text = result.text
      })
    return text
  }
}

module.exports = OcrService
