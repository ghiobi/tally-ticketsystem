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

  $('[data-submit-post]').on('click', function() {
    const url = $(this).data('submit-post')
    $.post(url, { _csrf: CSRF_TOKEN }, () => {
      location.reload()
    })
  })

  $('#downloadPDF').on('click', function() {
    const url = $(this).data('route')
    const type = 'PDF'
    downloadExpense(url, type)
  })

  $('#downloadCSV').on('click', function() {
    const url = $(this).data('route')
    const type = 'CSV'
    downloadExpense(url, type)
  })

  $('#downloadJSON').on('click', function() {
    const url = $(this).data('route')
    const type = 'JSON'
    downloadExpense(url, type)
  })

  function downloadExpense(url, type) {
    $.ajax({
      url: url,
      type: 'post',
      data: {
        _csrf: CSRF_TOKEN,
        type: type
      },
      success: function(response) {
        console.log(response)
      }
    })
  }

  function calculateReceiptIndices() {
    $('.receipt_details').each(function(index) {
      $(this).attr('id', 'receipt_details_' + index)
      $(this)
        .find('#line_id')
        .attr('name', 'id[' + index + ']')
      $(this)
        .find('#memo')
        .attr('name', 'memo[' + index + ']')
      $(this)
        .find('#category')
        .attr('name', 'category[' + index + ']')
      $(this)
        .find('#currency')
        .attr('name', 'currency[' + index + ']')
      $(this)
        .find('#region')
        .attr('name', 'region[' + index + ']')
      $(this)
        .find('#price')
        .attr('name', 'price[' + index + ']')
      $(this)
        .find('#tax')
        .attr('name', 'tax[' + index + ']')
      $(this)
        .find('#receipt_title')
        .html('Receipt ' + index)
      $(this)
        .find('.remove_receipt_button')
        .attr('id', 'remove_receipt_button_' + index)
    })
  }

  var receiptIndex = 0
  //add receipts dynamically
  $(document.body).on('click', '#add_receipt_button', function() {
    receiptIndex++

    if (receiptIndex > 0) {
      $('#remove_receipt_button').show()
    }

    var newLineItem = $('.receipt_details')
      .first()
      .clone()
    newLineItem.find('#memo').val('')
    newLineItem.find('#category').prop('selectedIndex', 0)
    newLineItem.find('#region').prop('selectedIndex', 0)
    newLineItem.find('#currency').prop('selectedIndex', 0)
    newLineItem.find('#price').val('')
    newLineItem.find('#tax').val('')
    newLineItem.find('#line_id').val('new')

    $('#expense_items').append(newLineItem)
    calculateReceiptIndices()
  })

  //remove receipts dynamically
  $(document.body).on('click', '[id^=remove_receipt_button]', function() {
    $(this)
      .closest('.receipt_details')
      .remove()
    calculateReceiptIndices()
  })
})
