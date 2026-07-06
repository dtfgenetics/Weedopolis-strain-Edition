export function subscribeWordPressRoom({ request, roomId, onChange, intervalMs = 1500 }) {
  let active = true;
  let lastVersion = null;

  async function tick() {
    if (!active) return;
    try {
      const room = await request(`/rooms/${encodeURIComponent(roomId)}`);
      const version = room?.game_state?.state_version || room?.state_version || null;
      if (version !== lastVersion) {
        lastVersion = version;
        onChange(room);
      }
    } finally {
      if (active) setTimeout(tick, intervalMs);
    }
  }

  tick();
  return { unsubscribe: () => { active = false; } };
}
