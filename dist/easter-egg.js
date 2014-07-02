/*!
 * easter-egg.js v0.5.0
 * https://github.com/gridonic/easter-egg.js
 *
 * Originally based on: https://github.com/snaptortoise/konami-js/
 *
 * Copyright 2014 @gridonic
 * Released under the MIT license
 *
 * Build: 2.7.2014
 */
(function (global) {

  'use strict';

  var EasterEgg;

  EasterEgg = function (options) {

    // Initialize default Options
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

      // Add Event
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

      // define patterns
      pattern: options.pattern,
      orig_pattern: options.pattern,

      // Load the EasterEgg
      load: function () {

        this.addEvent(document, 'keydown', function (e, ref_obj) {

          // IE // todo: why do we have to do this?
          if (ref_obj) {
            easter = ref_obj;
          }

          var entered = e ? e.keyCode : event.keyCode; // TODO: where is event coming from?

          // Call a function on input
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

            // Call a function when combo is broken.
            if (typeof options.onComboBreak === 'function') {
              options.onComboBreak(entered, easter.pattern, easter.orig_pattern);
            }

            // Reset the pattern, so we restart the whole function.
            easter.pattern = easter.orig_pattern;
          }

          // Success, all keys have been pressed
          if (easter.pattern.length === 0) {

            // Reset the pattern to the full length pattern from the options
            easter.pattern = easter.orig_pattern;

            // Call the success method
            easter.success();

            e.preventDefault();
            return false;
          }

          return true;

        }, this);

        this.touch.load();
      },

      // Called when easter egg is successfully finished.
      success: function () {

        var typeofOnSuccess = typeof options.onSuccess;

        if (typeofOnSuccess === 'function') {

          // onSuccess is a function, so call it now.
          options.onSuccess();

        } else if (typeofOnSuccess === 'string') {

          // onSuccess is a string, hopefully a URL. Load the Url
          window.location = options.onSuccess;

        }
      },

      // Touch events
      touch: {
        start_x: 0,
        start_y: 0,
        stop_x: 0,
        stop_y: 0,
        tap: false,
        capture: false,
        orig_patternTouch: options.patternTouch,
        patternTouch: options.patternTouch,

        // Load function of the touch part
        load: function () {

          easter.addEvent(document, 'touchmove', function (touchEvent) {

            //noinspection JSUnresolvedVariable
            if (touchEvent.touches.length == 1 && easter.touch.capture === true) {

              //noinspection JSUnresolvedVariable
              var touch = touchEvent.touches[0];

              easter.touch.stop_x = touch.pageX;
              easter.touch.stop_y = touch.pageY;
              easter.touch.tap = false;
              easter.touch.capture = false;
              easter.touch.check_direction();
            }
          });

          easter.addEvent(document, 'touchend', function () {
            if (easter.touch.tap === true) {
              easter.touch.check_direction();
            }
          }, false);

          easter.addEvent(document, 'touchstart', function (touchEvent) {

            //noinspection JSUnresolvedVariable
            easter.touch.start_x = touchEvent.changedTouches[0].pageX;

            //noinspection JSUnresolvedVariable
            easter.touch.start_y = touchEvent.changedTouches[0].pageY;

            easter.touch.tap = true;
            easter.touch.capture = true;
          });
        },

        // Check the direction of a touch move.
        check_direction: function () {
          var x_magnitude = Math.abs(this.start_x - this.stop_x);
          var y_magnitude = Math.abs(this.start_y - this.stop_y);
          var x = ((this.start_x - this.stop_x) < 0) ? '→' : '←';
          var y = ((this.start_y - this.stop_y) < 0) ? '↓' : '↑';
          var result = (x_magnitude > y_magnitude) ? x : y;
          result = (this.tap === true) ? 'tap' : result;

          // Call a function on input
          if (typeof options.onInput === 'function') {
            options.onInput(result, this.patternTouch, this.orig_patternTouch);
          }

          // Current input is next pattern in line
          if (result === this.patternTouch[0]) {
            this.patternTouch = this.patternTouch.slice(1, this.patternTouch.length);

            // Do something on correct input
            if (typeof options.onCorrectInput === 'function') {
              options.onCorrectInput(result, this.patternTouch, this.orig_patternTouch);
            }
          }

          // If not, reset the current input
          else {

            // Do something on combo breaker
            if (typeof options.onComboBreak === 'function') {
              options.onComboBreak(result, this.patternTouch, this.orig_patternTouch);
            }

            this.patternTouch = this.orig_patternTouch;
          }

          // Success, all patterns have benn pressed
          if (this.patternTouch.length === 0) {

            // Reset pattern to pattern from options
            this.patternTouch = this.orig_patternTouch;

            // Call the success method
            easter.success();
          }
        }
      } // Touch events
    };

    // Return the easter object and start it.
    return easter.load();
  };

  global.easterEgg = EasterEgg;

  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return EasterEgg;
    });
  }

  else if (typeof module !== 'undefined' && module !== null) {
    //noinspection JSUnresolvedVariable
    module.exports = EasterEgg;
  }

  return EasterEgg;

})(this);
