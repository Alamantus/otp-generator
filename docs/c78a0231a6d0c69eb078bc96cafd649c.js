// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({2:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '&', '$'];

var generatePad = exports.generatePad = function generatePad(length) {
  var pad = [];
  for (var i = 0; i < length; i++) {
    var letter = Math.floor(Math.random() * CHARS.length);
    pad.push(CHARS[letter]);
  }
  return pad;
};

var stripString = function stripString(string) {
  return string.replace(/[\s]+/g, '&').replace(/[^a-zA-Z0-9\&]/g, '$');
};

var encrypt = exports.encrypt = function encrypt(string) {
  var pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var strippedString = stripString(string).toUpperCase();
  pad = pad ? pad : generatePad(strippedString.length);
  return {
    oneTimePad: pad,
    encryptedMessage: pad.map(function (letter, index) {
      var messageLetter = strippedString.charAt(index);
      var letterValue = messageLetter !== '' ? CHARS.indexOf(messageLetter) : CHARS.length - 1;
      var padValue = CHARS.indexOf(letter);
      return CHARS[(letterValue + padValue) % CHARS.length];
    }).join('')
  };
};

var decrypt = exports.decrypt = function decrypt(string, pad) {
  string = string.toUpperCase();
  return pad.map(function (letter, index) {
    var letterValue = CHARS.indexOf(string.charAt(index));
    var padValue = CHARS.indexOf(letter);
    var charIndex = letterValue - padValue;
    while (charIndex < 0) {
      charIndex += CHARS.length;
    }
    return CHARS[charIndex % CHARS.length];
  }).join('').replace(/\&/g, ' ').replace(/\$/g, '-');
};

window.onload = function () {
  document.getElementById('encryptInput').onclick = function () {
    var error = document.getElementById('inputError');
    var input = document.getElementById('input').value;
    var inputPad = stripString(document.getElementById('inputPad').value).toUpperCase();
    var pad = inputPad !== '' ? inputPad.split('') : null;
    if (pad !== null && pad.length < input.length) {
      document.getElementById('inputPad').value = pad.join('');
      error.innerHTML = 'The pad must be at least as long as the input';
    } else {
      error.innerHTML = '';
      var encryption = encrypt(input, pad);
      document.getElementById('inputPad').value = encryption.oneTimePad.join('');
      document.getElementById('encrypted').innerHTML = encryption.encryptedMessage;
    }
  };

  document.getElementById('decryptInput').onclick = function () {
    var input = document.getElementById('encryptedInput').value;
    var pad = document.getElementById('encryptedInputPad').value.split('');
    var output = decrypt(input, pad);
    document.getElementById('decrypted').innerHTML = output;
  };

  document.getElementById('padLength').oninput = function (event) {
    var value = parseInt(event.target.value);
    if (value < 1) event.target.value = 1;
  };

  document.getElementById('generatePad').onclick = function () {
    var field = document.getElementById('padLength');
    if (field.value === '') {
      field.value = '10';
    }
    var length = parseInt(field.value, 10);
    var output = generatePad(length);
    document.getElementById('inputPad').value = output.join('');
  };

  document.getElementById('clearPad').onclick = function () {
    document.getElementById('padLength').value = '';
    document.getElementById('inputPad').value = '';
  };
};
},{}]},{},[2])