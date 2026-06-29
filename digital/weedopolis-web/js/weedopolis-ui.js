/* Minimal Weedopolis UI placeholder. Codex should expand this file into the full visual board renderer. */
window.addEventListener('DOMContentLoaded', function () {
  const board = document.getElementById('board');
  const setup = document.getElementById('setupPanel');
  const names = document.getElementById('playerNameGrid');
  const turn = document.getElementById('turnPanel');
  const players = document.getElementById('playersPanel');
  const log = document.getElementById('logPanel');
  for (let i = 1; i <= 8; i += 1) {
    const input = document.createElement('input');
    input.placeholder = 'Player ' + i;
    if (i <= 2) input.value = 'Player ' + i;
    names.appendChild(input);
  }
  function render(state) {
    board.textContent = '';
    window.WEEDOPOLIS_EDITION.spaces.forEach(function (space) {
      const tile = document.createElement('div');
      tile.className = 'tile ' + space.side + ' ' + space.type;
      tile.textContent = space.spaceNumber + '. ' + space.name + (space.price ? ' - ' + space.price + ' BB' : '');
      board.appendChild(tile);
    });
    if (!state) return;
    setup.classList.add('hidden');
    const p = state.players[state.turn];
    turn.textContent = p.name + ' at ' + state.spaces[p.position].name + ' with ' + p.money + ' Bud Bucks.';
    players.textContent = state.players.map(function (x) { return x.name + ': ' + x.money + ' BB'; }).join(' | ');
    log.textContent = state.log.join('\n');
  }
  window.WeedopolisGame.onChange(render);
  render(null);
  document.getElementById('startGameBtn').addEventListener('click', function () {
    window.WeedopolisGame.newGame(Array.from(names.querySelectorAll('input')).map(function (input) { return input.value; }));
  });
  document.getElementById('loadGameBtn').addEventListener('click', function () { window.WeedopolisGame.load(); });
  document.getElementById('newGameTopBtn').addEventListener('click', function () { window.WeedopolisGame.clearSave(); location.reload(); });
});
