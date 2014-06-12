// Cross-platform placeholders
$(function() {
  function setPlaceholder() {
    var $this = $(this);
    if (!$this.val()) {
      // Change type for password input to show placeholder
      if ($this.attr('type') === 'password') {
        $this.data('type-is-password', true).attr('type', 'text');
      }

      $this.val($this.attr('placeholder'));
    }
  }

  function unsetPlaceholder() {
    var $this = $(this);
    if ($this.val() === $this.attr('placeholder')) {
      // Change back type for password input
      if ($this.data('type-is-password')) {
        $this.attr('type', 'password');
      }

      $this.val('');
    }
  }

  function configAllPlaceholders() {
    $('input[placeholder]').each(function() {
      setPlaceholder.call(this);
      $(this)
        .on('focus', unsetPlaceholder)
        .on('blur', setPlaceholder);
    });
  }

  if (!Modernizr.input.placeholder) {
    configAllPlaceholders();
  }
});

// Form submitting
$(function() {
  function $successAjax(options) {
    if (options.success) {
      setTimeout(function ajaxSuccessCallback() {
        options.success.call(options.context);
      }, 200);
    }
  }

  function $errorAjax(options) {
    if (options.error) {
      setTimeout(function ajaxErrorCallback() {
        options.error.call(options.context, {
          responseJSON: {
            errors: {
              first_name: 'Это поле обязательное',
              password: 'Слишком простой пароль',
              email: 'Неверный формат email '
            }
          }
        });
      }, 200);
    }
  }

  function $fakeAjax(result, options) {
    switch(result) {
      case 'success':
        $successAjax(options);
        break;
      case 'error':
        $errorAjax(options);
        break;
    }
  }

  function submitFormWithResult(result) {
    return function(e) {
      e.preventDefault();

      hideValidationsErrors();

      $fakeAjax(result, {
        url : '/register',
        method: 'POST',
        dataType: 'json',
        data: $('js-register-form form').serializeArray(),

        success: function onRegisterSuccess() {
          $('.js-register-form').hide();
          $('.js-register-thank-you').show();
        },

        error: function onRegisterError(data) {
          if (data.responseJSON && data.responseJSON.errors) {
            showValidationsErrors(data.responseJSON.errors);
          }
        }
      });
    };
  }

  function showValidationsErrors(errors) {
    $.each(errors, function(field, error) {
      var $errorMsg = $('<span>').addClass('help-block').text(error);

      $('#' + field)
        .after($errorMsg)
        .closest('.form-group').addClass('has-error');
    });
  }

  function hideValidationsErrors() {
    $('.form-group.has-error').removeClass('has-error');
    $('.help-block').remove();
  }

  $('.js-btn-success').on('click', submitFormWithResult('success'));
  $('.js-btn-error').on('click', submitFormWithResult('error'));
});
