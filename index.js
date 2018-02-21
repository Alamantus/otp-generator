const CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
  'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '&', '$',
];

export const generatePad = (length) => {
  const pad = [];
  for (let i = 0; i < length; i++) {
    const letter = Math.floor(Math.random() * CHARS.length);
    pad.push(CHARS[letter]);
  }
  return pad;
}

const stripString = (string) => {
  return string.replace(/[\s]+/g, '&').replace(/[^a-zA-Z0-9\&]/g, '$');
}

export const encrypt = (string, pad = null) => {
  const strippedString = stripString(string).toUpperCase();
  pad = pad ? pad : generatePad(strippedString.length);
  return {
    oneTimePad: pad,
    encryptedMessage: pad.map((letter, index) => {
      const messageLetter = strippedString.charAt(index);
      const letterValue = messageLetter !== '' ? CHARS.indexOf(messageLetter) : CHARS.length - 1;
      const padValue = CHARS.indexOf(letter);
      return CHARS[(letterValue + padValue) % CHARS.length];
    }).join(''),
  };
}

export const decrypt = (string, pad) => {
  string = string.toUpperCase();
  return pad.map((letter, index) => {
    const letterValue = CHARS.indexOf(string.charAt(index));
    const padValue = CHARS.indexOf(letter);
    let charIndex = (letterValue - padValue);
    while (charIndex < 0) {charIndex += CHARS.length}
    return CHARS[charIndex % CHARS.length];
  }).join('').replace(/\&/g, ' ').replace(/\$/g, '-');
}

window.onload = () => {
  document.getElementById('encryptInput').onclick = () => {
    const error = document.getElementById('inputError');
    const input = document.getElementById('input').value;
    const inputPad = stripString(document.getElementById('inputPad').value).toUpperCase();
    const pad = inputPad !== '' ? inputPad.split('') : null;
    if (pad !== null && pad.length < input.length) {
      document.getElementById('inputPad').value = pad.join('');
      error.innerHTML = 'The pad must be at least as long as the input';
    } else {
      error.innerHTML = '';
      const encryption = encrypt(input, pad);
      document.getElementById('inputPad').value = encryption.oneTimePad.join('');
      document.getElementById('encrypted').innerHTML = encryption.encryptedMessage;
    }
  }

  document.getElementById('decryptInput').onclick = () => {
    const input = document.getElementById('encryptedInput').value;
    const pad = document.getElementById('encryptedInputPad').value.split('');
    const output = decrypt(input, pad);
    document.getElementById('decrypted').innerHTML = output;
  }

  document.getElementById('padLength').oninput = (event) => {
    const value = parseInt(event.target.value);
    if (value < 1) event.target.value = 1;
  }

  document.getElementById('generatePad').onclick = () => {
    const field = document.getElementById('padLength');
    if (field.value === '') {
      field.value = '10';
    }
    const length = parseInt(field.value, 10);
    const output = generatePad(length);
    document.getElementById('inputPad').value = output.join('');
  }
}
