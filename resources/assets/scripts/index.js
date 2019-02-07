var organizationRoute =
  window.location.pathname.split('/')[1] +
  '/' +
  window.location.pathname.split('/')[2]

$(document).ready(() => {
  $('#user_submit_ticket_btn').click((element) => {
    element.preventDefault()
    const formData = $('form#submit_ticket_form').serialize()
    submitTicket(formData)
  })
})

function submitTicket(formData) {
  $.ajax({
    url: '/' + organizationRoute + '/submit/ticket',
    type: 'POST',
    dataType: 'json',
    data: formData,
    success: (msg) => {
      DisplaySuccess(msg)
    },
    error: (err) => {
      DisplayError('Error code: ' + err.status + ': ' + err.responseText)
    }
  })
}

function DisplaySuccess(msg) {
  toastr.success(msg)
}

function DisplayError(msg) {
  toastr.error(msg)
}
