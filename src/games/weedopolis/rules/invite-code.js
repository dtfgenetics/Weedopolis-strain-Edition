export function makeCode(random = Math.random) {
  return random().toString(36).slice(2, 8).toUpperCase();
}

export function makeInvite(code, base = 'https://dtfseeds.com/games/weedopolis/') {
  return `${base}?game=${encodeURIComponent(code)}`;
}
