import { loadBoardMap } from '../data/load-board-map.js';

export async function loadPreviewData() {
  // Resolve the board data from the module location instead of the browser page URL.
  // This keeps the preview portable when packaged under /games/weedopolis/.
  const boardMapUrl = new URL('../../../../data/board_map.csv', import.meta.url);
  const boardRows = await loadBoardMap(boardMapUrl);
  return { boardRows };
}
