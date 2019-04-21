$(() => {
  const CSRF_TOKEN = $('meta[name="CSRF_TOKEN"]').attr('content')

  $.ajaxSetup({
    beforeSend(xhr) {
      xhr.setRequestHeader('X-CSRF-TOKEN', CSRF_TOKEN)
    }
  })

  /**
   * Delegate submit button to a form.
   */
  $('[data-submit-post]').on('click', function() {
    const url = $(this).data('submit-post')
    $.post(url, { _csrf: CSRF_TOKEN }, () => {
      location.reload()
    })
  })

  $('#exportSelectAll').on('click', function() {
    if ($(this).is(':checked')) {
      $('input[name=ticket]').prop('checked', true)
    } else {
      $('input[name=ticket]').prop('checked', false)
    }
  })

  $('.submit-export').on('click', function() {
    const type = $(this).data('type')
    $('#exportTypeInput').val(type)
    $('#exportForm').submit()
  })

  $('#downloadPDF').on('click', function() {
    const url = $(this).data('route')
    const type = 'PDF'
    downloadTicket(url, type)
  })

  $('#downloadCSV').on('click', function() {
    const url = $(this).data('route')
    const type = 'CSV'
    downloadTicket(url, type)
  })

  $('#downloadJSON').on('click', function() {
    const url = $(this).data('route')
    const type = 'JSON'
    downloadTicket(url, type)
  })

  $('#downloadYAML').on('click', function() {
    const url = $(this).data('route')
    const type = 'YAML'
    downloadTicket(url, type)
  })

  function downloadTicket(url, type) {
    let downloadForm = $('<form>', {
      action: url,
      method: 'post'
    }).append(
      $('<input>', {
        type: 'hidden',
        name: '_csrf',
        value: CSRF_TOKEN
      }).append(
        $('<input>', {
          type: 'hidden',
          name: 'type',
          value: type
        })
      )
    )

    $(document.body).append(downloadForm)
    downloadForm.submit()
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
        .html('Receipt ' + (index + 1))
      $(this)
        .find('.remove_receipt_button')
        .attr('id', 'remove_receipt_button_' + index)
      $(this)
        .find('#receipt-upload')
        .attr('name', 'receipt[' + index + ']')
      $('.receipt-upload').change(function() {
        $('#loading-overlay').show()
      })
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
    newLineItem.find('#region').val('CAD-QC')
    newLineItem.find('#currency').val('CAD')
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

  $('.receipt-upload').change(function() {
    $('#loading-overlay').show()
  })
})
