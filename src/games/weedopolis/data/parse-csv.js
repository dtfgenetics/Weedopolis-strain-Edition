export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitLine(lines.shift());
  return lines.map((line) => {
    const values = splitLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

function splitLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;

  for (const char of line) {
    if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}
