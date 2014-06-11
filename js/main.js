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
