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
})
