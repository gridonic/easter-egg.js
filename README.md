# easter-egg.js

Listens to keystroke or swipe and touch events and react upon entry of a certain sequence.

When including easter-egg.js in your html, easterEgg is bound to the global namespace. The code also supports UMD and AMD style module loading.

## How to use

Instantiate easterEgg with a settings object. For example:

```js
(function (EasterEgg) {
    new EasterEgg({
        pattern: [38, 38, 40, 40, 37, 37, 39, 39],
        patternTouch: ['↑', '↑', '↓', '↓', '←', '←', '→', '→']
      });
})(window.easterEgg);
```

This defines one pattern for keyboards and one for touch enabled devices. They are independent and can be different.

For the keyboard pattern we use the standard Javascript key codes. See for example http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes for a list.

For touch enabled devices you can use the following symbols:

- Swipe-Up: '↑'
- Swipe-Down: '↓'
- Swipe-Left: '←'
- Swipe-Right: '→'
- Tap: 'tap'

So far nothing happens when keys are pressed or when the right sequence has been typed in. There are three API methods which you can use:

- onCorrectInput: Fires when the next, correct key (touch-event) has been entered.
- onComboBreak: Fires when the sequence has been broken, i.e. a wrong key (touch-event) was entered. The sequence gets reset, and users have to start anew.
- onSuccess: Fires when the whole sequence has been entered correctly.

Let's see a complete example:

```js
(function (EasterEgg) {

  new EasterEgg({
    pattern: [38, 38, 40, 40, 37, 37, 39, 39],
    patternTouch: ['↑', '↑', '↓', '↓', '←', '←', '→', '→'],

    /* onSuccess can either be an url or a function. */
    // onSuccess: 'http://google.com',
    onSuccess: function() {
      console.log('Code was entered correctly!');
    },

    onCorrectInput: function(entered, current, pattern) {
      console.log('ENTERED: '+ entered);
      console.log('REST: '+ current);
    },

    onComboBreak: function(entered, current, pattern) {
      console.log(ENTERED + ': Combo breaker :(');
    }
  });

})(window.easterEgg);
```

The latter two API methods have three arguments:
- entered: The key or touch-event that was entered
- current: Current sequence part that was entered correctly
- pattern: the whole sequence which must be entered correctly

A working example can be found in examples/index.html

## Build

If you want to contribute and build easter-egg.js yourself you must install node / npm first:
You can download it from [http://nodejs.org/download/](http://nodejs.org/download/).
Then you can simply run to install all necessary dependencies:

```sh
$ npm install
```

To start the gulp build process and a watch task, just run:

```sh
$ gulp
```

## TODO
- Finish readme
- Better code structure
- Remove URL as callback 'option', not needed
- Create a separate script which captures keystroke and translates them to key code for use in the config
- Cleanup

## Acknowledgements
Based originally on konami.js (https://github.com/snaptortoise/konami-js/)
