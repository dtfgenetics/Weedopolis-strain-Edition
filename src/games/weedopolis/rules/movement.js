export function movePosition(position, steps, boardSize = 40) {
  const raw = position + steps;
  return {
    position: ((raw - 1) % boardSize) + 1,
    passedStart: raw > boardSize
  };
}

export function applyStartReward(balance, passedStart, landedStart, reward = 200) {
  return balance + (passedStart || landedStart ? reward : 0);
}
