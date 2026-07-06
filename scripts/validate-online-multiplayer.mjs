import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createMissingMultiplayerAdapter, assertMultiplayerAdapter } from '../src/games/weedopolis/multiplayer/adapter.js';
import { createOnlineRoomDraft } from '../src/games/weedopolis/multiplayer/room-factory.js';

const schema = JSON.parse(fs.readFileSync('data/multiplayer_schema.json', 'utf8'));
assert.equal(schema.provider, 'supabase_realtime_first');
assert(schema.room.invite_code);
assert(schema.player.player_id);
assert(schema.game_state.state_json);
assert(schema.event.event_type);

const adapter = createMissingMultiplayerAdapter();
assertMultiplayerAdapter(adapter);

const draft = createOnlineRoomDraft({ hostName: 'Host', baseUrl: 'https://dtfseeds.com/games/weedopolis/' });
assert(draft.room.room_id.startsWith('room_'));
assert(draft.room.invite_code.length >= 4);
assert(draft.room.invite_url.includes('game='));
assert.equal(draft.hostPlayer.room_id, draft.room.room_id);
assert.equal(draft.initialState.room_id, draft.room.room_id);
assert.equal(draft.initialState.phase, 'lobby');

const sql = fs.readFileSync('supabase/weedopolis_multiplayer.sql', 'utf8');
for (const table of ['weedopolis_rooms', 'weedopolis_players', 'weedopolis_game_states', 'weedopolis_events']) {
  assert(sql.includes(table));
}

console.log('online multiplayer validation passed');
