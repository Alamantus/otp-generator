const CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
  'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

function generatePad(string) {
  const pad = [];
  for (let i = 0; i < string.length; i++) {
    const letter = Math.floor(Math.random() * CHARS.length);
    pad.push(letter);
  }
  return pad;
}

function encrypt(string) {
  const strippedString = string.replace(/[^A-Z0-9]/g, '');
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

function decrypt(string, pad) {
  return string.split('').map((letter, index) => {
    const letterValue = CHARS.indexOf(letter);
    const padValue = CHARS.indexOf(pad[index]);
    return CHARS[(letterValue - padValue) % CHARS.length];
  }).join('');
}
