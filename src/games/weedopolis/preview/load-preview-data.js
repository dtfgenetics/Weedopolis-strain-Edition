import { loadBoardMap } from '../data/load-board-map.js';

export async function loadPreviewData() {
  const boardRows = await loadBoardMap('../../data/board_map.csv');
  return { boardRows };
}
