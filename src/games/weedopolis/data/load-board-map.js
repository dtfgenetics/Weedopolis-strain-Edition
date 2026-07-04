import { parseCsv } from './parse-csv.js';

export async function loadBoardMap(url = '../../data/board_map.csv') {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load board map: ${response.status}`);
  const text = await response.text();
  return parseCsv(text);
}
