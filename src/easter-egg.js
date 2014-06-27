(function (global) {

  'use strict';

  var EasterEgg;

  EasterEgg = function (options) {

    var defaultOptions = {
      // Konami Code: '↑', '↑', '↓', '↓', '←', '→', '→', '←', 'b', 'a'
      pattern: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
      patternTouch: ['↑', '↑', '↓', '↓', '←', '→', '→', '←', 'tap', 'tap'],
      onInput: null,
      onCorrectInput: null,
      onComboBreak: null,
      onSuccess: null
    };

    // Merging options with defaults
    for (var index in defaultOptions) {
      if (defaultOptions.hasOwnProperty(index) && !options.hasOwnProperty(index)) {
        options[index] = defaultOptions[index];
      }
    }

    var easter = {

      addEvent: function (obj, type, fn, ref_obj) {

        if (obj.addEventListener) {
          obj.addEventListener(type, fn, false);
        }

        // IE does not know addEventListener
        else if (obj.attachEvent) {

          obj['e' + type + fn] = fn;

          obj[type + fn] = function () {
            obj['e' + type + fn](window.event, ref_obj);
          };

          obj.attachEvent('on' + type, obj[type + fn]);
        }
      },
      pattern: options.pattern,
      orig_pattern: options.pattern,
      load: function (link) {
        this.addEvent(document, 'keydown', function (e, ref_obj) {

          // IE // todo: why do we have to do this?
          if (ref_obj) {
            easter = ref_obj;
          }

          var entered = e ? e.keyCode : event.keyCode; // TODO: where is event coming from?

          // Do something on input
          if (typeof options.onInput === 'function') {
            options.onInput(entered, easter.pattern, easter.orig_pattern);
          }

          // Current input is next key in line
          if (entered === easter.pattern[0]) {
            easter.pattern = easter.pattern.slice(1, easter.pattern.length);

            // Do something on correct input
            if (typeof options.onCorrectInput === 'function') {
              options.onCorrectInput(entered, easter.pattern, easter.orig_pattern);
            }
          }

          // If not, reset the current input
          else {

            // Do something on combo breaker
            if (typeof options.onComboBreak === 'function') {
              options.onComboBreak(entered, easter.pattern, easter.orig_pattern);
            }

            easter.pattern = easter.orig_pattern;
          }

          // Success, all keys have been pressed
          if (easter.pattern.length === 0) {
            easter.pattern = easter.orig_pattern;
            easter.code(link);
            e.preventDefault();

            return false;
          }


        }, this);

        this.touch.load(link);
      },
      code: function (link) {
        window.location = link;
      },
      touch: {
        start_x: 0,
        start_y: 0,
        stop_x: 0,
        stop_y: 0,
        tap: false,
        capture: false,
        orig_keys: options.patternTouch,
        keys: options.patternTouch,
        code: function (link) {
          easter.code(link);
        },
        load: function (link) {

          easter.addEvent(document, 'touchmove', function (e) {
            if (e.touches.length == 1 && easter.touch.capture === true) {
              var touch = e.touches[0];
              easter.touch.stop_x = touch.pageX;
              easter.touch.stop_y = touch.pageY;
              easter.touch.tap = false;
              easter.touch.capture = false;
              easter.touch.check_direction();
            }
          });

          easter.addEvent(document, 'touchend', function () {
            if (easter.touch.tap === true) {
              easter.touch.check_direction(link);
            }
          }, false);

          easter.addEvent(document, 'touchstart', function (evt) {
            easter.touch.start_x = evt.changedTouches[0].pageX;
            easter.touch.start_y = evt.changedTouches[0].pageY;
            easter.touch.tap = true;
            easter.touch.capture = true;
          });
        },
        check_direction: function (link) {
          var x_magnitude = Math.abs(this.start_x - this.stop_x);
          var y_magnitude = Math.abs(this.start_y - this.stop_y);
          var x = ((this.start_x - this.stop_x) < 0) ? '→' : '←';
          var y = ((this.start_y - this.stop_y) < 0) ? '↓' : '↑';
          var result = (x_magnitude > y_magnitude) ? x : y;
          result = (this.tap === true) ? 'tap' : result;

          // Do something on any input
          if (typeof options.onInput === 'function') {
            options.onInput(result, this.keys, this.orig_keys);
          }

          // Current input is next key in line
          if (result === this.keys[0]) {
            this.keys = this.keys.slice(1, this.keys.length);

            // Do something on correct input
            if (typeof options.onCorrectInput === 'function') {
              options.onCorrectInput(result, this.keys, this.orig_keys);
            }
          }

          // If not, reset the current input
          else {

            // Do something on combo breaker
            if (typeof options.onComboBreak === 'function') {
              options.onComboBreak(result, this.keys, this.orig_keys);
            }

            this.keys = this.orig_keys;
          }

          // Success, all keys have benn pressed
          if (this.keys.length === 0) {
            this.keys = this.orig_keys;
            this.code(link);
          }
        }
      }
    };

    // Initialize easter with new window.location as onSuccess action
    typeof options.onSuccess === 'string' && easter.load(options.onSuccess);

    // Initialize easter with an onSucccess function
    if (typeof options.onSuccess === 'function') {
      easter.code = options.onSuccess;
      easter.load();
    }

    return easter;
  };

  global.easterEgg = EasterEgg;

  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return EasterEgg;
    });
  }

  else if (typeof module !== 'undefined' && module !== null) {
    module.exports = EasterEgg;
  }

  return EasterEgg;

})(this);
