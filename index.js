const CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
  'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '$'
];

const generatePad = (string) => {
  const pad = [];
  for (let i = 0; i < string.length; i++) {
    const letter = Math.floor(Math.random() * CHARS.length);
    pad.push(CHARS[letter]);
  }
  return pad;
}

export const encrypt = (string) => {
  const strippedString = string.replace(/[\s]+/g, '$').replace(/[^a-zA-Z0-9\$]/g, '');
  const pad = generatePad(strippedString);
  return {
    oneTimePad: pad,
    encryptedMessage: strippedString.toUpperCase().split('').map((letter, index) => {
      const letterValue = CHARS.indexOf(letter);
      const padValue = CHARS.indexOf(pad[index]);
      return CHARS[(letterValue + padValue) % CHARS.length];
    }).join(''),
  };
}

export const decrypt = (string, pad) => {
  return string.split('').map((letter, index) => {
    const letterValue = CHARS.indexOf(letter);
    const padValue = CHARS.indexOf(pad[index]);
    let charIndex = (letterValue - padValue);
    while (charIndex < 0) {charIndex += CHARS.length}
    return CHARS[charIndex % CHARS.length];
  }).join('').replace(/\$/g, ' ');
}

document.getElementById('encryptInput').onclick = () => {
  const input = document.getElementById('input').value;
  const encryption = encrypt(input);
  document.getElementById('pad').innerHTML = encryption.oneTimePad.join('');
  document.getElementById('encrypted').innerHTML = encryption.encryptedMessage;
}

document.getElementById('decryptInput').onclick = () => {
  const input = document.getElementById('encryptedInput').value;
  const pad = document.getElementById('encryptedInputPad').value.split('');
  const output = decrypt(input, pad);
  document.getElementById('decrypted').innerHTML = output;
}
