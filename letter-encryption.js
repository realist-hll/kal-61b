// Add letter payload encryption alongside the existing digit cipher.
// This file loads after app.js so the existing cipher sheet and key controls
// are already initialized.
window.updateEncrypt = function updateEncrypt() {
  const rowLetter = document.getElementById('enc-row').value;
  const colLetter = document.getElementById('enc-col').value;
  if (!rowLetter || !colLetter) return;

  const rowIndex = ALPHABET.indexOf(rowLetter);
  highlightColumnForLetter(rowIndex, colLetter);
  const target = resolve(rowLetter, colLetter).target;
  const targetIndex = ALPHABET.indexOf(target);
  const targetRow = sheetData[targetIndex];
  if (!targetRow) return;

  const counts = Array(COL_SIZES.length).fill(0);
  const digits = document.getElementById('enc-digits').value.replace(/[^0-9]/g, '');
  const letters = [...document.getElementById('enc-letters').value.toUpperCase()]
    .filter(letter => ALPHABET.includes(letter));

  positionSliderToRow(targetIndex);

  const encryptedDigits = [...digits].map(character => {
    const column = Number(character);
    const pool = targetRow.cols[column];
    return pool[counts[column]++ % pool.length];
  }).join('');

  const encryptedLetters = letters.map(letter => {
    const column = targetRow.cols.findIndex(group => group.includes(letter));
    if (column < 0) return '';

    const pool = targetRow.cols[column];
    const cipherLetter = pool[counts[column]++ % pool.length];
    highlightCipherLetter(targetIndex, column, cipherLetter);
    return cipherLetter;
  }).join('');

  const payload = [encryptedDigits, encryptedLetters].filter(Boolean).join(' ');
  document.getElementById('out-ciphertext').textContent =
    `${rowLetter}${colLetter}${payload ? ' ' + payload : ''}`;
};

// Replace the original handlers (which were registered by app.js) so updates
// from controls and cipher-sheet selections all use the letter-aware routine.
document.getElementById('enc-row').onchange = window.updateEncrypt;
document.getElementById('enc-col').onchange = window.updateEncrypt;
document.getElementById('enc-digits').oninput = window.updateEncrypt;
document.getElementById('enc-letters').oninput = window.updateEncrypt;
window.updateEncrypt();
