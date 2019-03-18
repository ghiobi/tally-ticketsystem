$(() => {
  const CSRF_TOKEN = $('meta[name="CSRF_TOKEN"]').attr('content')

  /**
   * Delegate submit button to a form.
   */
  $('[data-submit-post]').on('click', function() {
    const url = $(this).data('submit-post')
    $.post(
      url,
      {
        _csrf: CSRF_TOKEN
      },
      () => {
        location.reload()
      }
    )
  })

  var receiptIndex = 0
  //add receipts dynamically
  $('#add_receipt_button').click(function() {
    receiptIndex++

    if (receiptIndex > 0) {
      $('#remove_receipt_button').show()
    }

    var newDiv = $('#receipt_details_0').clone()
    newDiv
      .attr('id', 'receipt_details_' + receiptIndex)
      .hide()
      .fadeIn('fast')
      .insertAfter('#receipt_details_' + (receiptIndex - 1))
      .find('#receipt_title')
      .html('Receipt ' + (receiptIndex + 1))
    newDiv
      .find('#memo')
      .attr('name', 'memo[' + receiptIndex + ']')
      .val('')
    newDiv.find('#category').attr('name', 'category[' + receiptIndex + ']')
    newDiv.find('#currency').attr('name', 'currency[' + receiptIndex + ']')
    newDiv.find('#region').attr('name', 'region[' + receiptIndex + ']')
    newDiv
      .find('#price')
      .attr('name', 'price[' + receiptIndex + ']')
      .val('')
    newDiv
      .find('#tax')
      .attr('name', 'tax[' + receiptIndex + ']')
      .val('')
  })

  //remove receipts dynamically
  $('#remove_receipt_button').click(function() {
    $('#receipt_details_' + receiptIndex).fadeOut('fast', function() {
      $(this).remove()
    })

    receiptIndex--

    if (receiptIndex < 1) {
      $('#remove_receipt_button').hide()
    }
  })
})
