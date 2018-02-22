import 'babel-polyfill';
import 'whatwg-fetch';

const CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
  'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '&', '$',
];

export const generatePad = (length) => {
  return fetch(`https://www.random.org/integers/?num=${length}&min=0&max=${CHARS.length - 1}&col=1&base=10&format=plain&rnd=new`)
    .then(response => response.text()).then(text => text.split('\n').map(number => CHARS[parseInt(number)]));
}

const stripString = (string) => {
  return string.replace(/[\s]+/g, '&').replace(/[^a-zA-Z0-9\&]/g, '$');
}

export const encrypt = (string, pad = null) => {
  const strippedString = stripString(string).toUpperCase();
  const padPromise = pad ? Promise.resolve(pad) : generatePad(strippedString.length);
  return padPromise.then(pad => {
    return {
      oneTimePad: pad,
      encryptedMessage: pad.map((letter, index) => {
        const messageLetter = strippedString.charAt(index);
        const letterValue = messageLetter !== '' ? CHARS.indexOf(messageLetter) : CHARS.length - 1;
        const padValue = CHARS.indexOf(letter);
        return CHARS[(letterValue + padValue) % CHARS.length];
      }).join(''),
    };
  });
}

export const decrypt = (string, pad) => {
  string = string.toUpperCase();
  const message = pad.map((letter, index) => {
    const letterValue = CHARS.indexOf(string.charAt(index));
    const padValue = CHARS.indexOf(letter);
    let charIndex = (letterValue - padValue);
    while (charIndex < 0) {charIndex += CHARS.length}
    return CHARS[charIndex % CHARS.length];
  }).join('').replace(/\&/g, ' ').replace(/\$/g, '-');
  return Promise.resolve(message);
}

window.onload = () => {
  const encryptButton = document.getElementById('encryptInput');
  encryptButton.onclick = () => {
    const error = document.getElementById('inputError');
    const input = document.getElementById('input').value;
    const inputPad = stripString(document.getElementById('inputPad').value).toUpperCase();
    const pad = inputPad !== '' ? inputPad.split('') : null;
    if (pad !== null && pad.length < input.length) {
      document.getElementById('inputPad').value = pad.join('');
      error.innerHTML = 'The pad must be at least as long as the input';
    } else {
      error.innerHTML = '';
      encryptButton.classList.add('is-loading');
      encryptButton.disabled = true;
      encrypt(input, pad).then(encryption => {
        document.getElementById('padLength').value = encryption.oneTimePad.length;
        document.getElementById('inputPad').value = encryption.oneTimePad.join('');
        document.getElementById('encrypted').innerHTML = encryption.encryptedMessage;
        encryptButton.classList.remove('is-loading');
        encryptButton.disabled = false;
      });
    }
  }

  document.getElementById('decryptInput').onclick = () => {
    const input = document.getElementById('encryptedInput').value;
    const pad = document.getElementById('encryptedInputPad').value.split('');
    decrypt(input, pad).then(output => {
      document.getElementById('decrypted').innerHTML = output;
    });
  }

  document.getElementById('padLength').oninput = (event) => {
    const value = parseInt(event.target.value);
    if (value < 1) event.target.value = 1;
  }

  const generatePadButton = document.getElementById('generatePad');
  generatePadButton.onclick = () => {
    const field = document.getElementById('padLength');
    if (field.value === '') {
      field.value = '10';
    }
    const length = parseInt(field.value, 10);
    generatePadButton.classList.add('is-loading');
    generatePadButton.disabled = true;
    generatePad(length).then(output => {
      document.getElementById('inputPad').value = output.join('');
      generatePadButton.classList.remove('is-loading');
      generatePadButton.disabled = false;
    });
  }

  document.getElementById('clearPad').onclick = () => {
    document.getElementById('padLength').value = '';
    document.getElementById('inputPad').value = '';
  }
}
