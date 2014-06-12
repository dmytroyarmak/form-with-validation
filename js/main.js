// Cross-platform placeholders
$(function() {
  var setPlaceholder = function() {
    var $this = $(this);
    if (!$this.val()) {
      // Change type for password input to show placeholder
      if ($this.attr('type') === 'password') {
        $this.data('type-is-password', true).attr('type', 'text');
      }

      $this.val($this.attr('placeholder'));
    }
  };

  var unsetPlaceholder = function() {
    var $this = $(this);
    if ($this.val() === $this.attr('placeholder')) {
      // Change back type for password input
      if ($this.data('type-is-password')) {
        $this.attr('type', 'password');
      }

      $this.val('');
    }
  };

  var configAllPlaceholders = function() {
    $('input[placeholder]').each(function() {
      setPlaceholder.call(this);
      $(this)
        .on('focus', unsetPlaceholder)
        .on('blur', setPlaceholder);
    });
  };

  if (!Modernizr.input.placeholder) {
    configAllPlaceholders();
  }
});

$(function() {
  var $form = $('js-register-form form');

  var $successAjax = function(options) {
    if (options.success) {
      setTimeout(function ajaxSuccessCallback() {
        options.success.call(options.context);
      }, 200);
    }
  };

  var $errorAjax = function(options) {
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
  };

  var showValidationsErrors = function(errors) {
    $.each(errors, function(field, error) {
      var $errorMsg = $('<span>').addClass('help-block').text(error);

      $('#' + field)
        .after($errorMsg)
        .closest('.form-group').addClass('has-error');
    });
  };

  var hideValidationsErrors = function() {
    $('.form-group.has-error').removeClass('has-error');
    $('.help-block').remove();
  };

  $('.js-btn-success').on('click', function(e) {
    e.preventDefault();

    hideValidationsErrors();

    $successAjax({
      url : '/register',
      method: 'POST',
      dataType: 'json',
      data: $form.serializeArray(),
      success: function onSubmitSuccess() {
        $('.js-register-form').hide();
        $('.js-register-thank-you').show();
      }
    });
  });

  $('.js-btn-error').on('click', function(e) {
    e.preventDefault();

    hideValidationsErrors();

    $errorAjax({
      url : '/register',
      method: 'POST',
      dataType: 'json',
      data: $form.serializeArray(),
      error: function onSubmitError(data) {
        if (data.responseJSON && data.responseJSON.errors) {
          showValidationsErrors(data.responseJSON.errors);
        }
      }
    });
  });
});
