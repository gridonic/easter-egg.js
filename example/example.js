(function (EasterEgg, $) {

  new EasterEgg({
    pattern: [38, 38, 40, 40, 37, 37, 39, 39],
    patternTouch: ['↑', '↑', '↓', '↓', '←', '←', '→', '→'],

    /* onSuccess can either be an url or a function. */
    // onSuccess: 'http://google.com',
    onSuccess: function() {
      console.log('Code was entered correctly!');

      $('.current').html('');
      $('.result').fadeIn(200).fadeOut(2000);
    },

    onCorrectInput: function(entered, current, pattern) {
      console.log('ENTERED: '+ entered);
      console.log('REST: '+ current);

      $('.current').append('<span class="key">' + entered + '</span>');
    },

    onComboBreak: function(entered, current, pattern) {
      console.log(ENTERED + ': Combo breaker :(');

      $('.current').html('');
    }
  });

  $('.pattern').html('↑ ↑ ↓ ↓ ← ← → →');
  $('.result').hide().html('Easter Egg\'d!');

})(window.easterEgg, window.jQuery);
