import { assertMultiplayerAdapter } from './adapter.js';

export function createSupabaseMultiplayerAdapter({ client, baseUrl }) {
  if (!client) throw new Error('Supabase client is required.');

  const adapter = {
    async createRoom({ room, hostPlayer, initialState }) {
      await client.from('weedopolis_rooms').insert(room);
      await client.from('weedopolis_players').insert(hostPlayer);
      await client.from('weedopolis_game_states').insert(initialState);
      return room;
    },

    async joinRoom({ inviteCode, player }) {
      const { data: room, error } = await client
        .from('weedopolis_rooms')
        .select('*')
        .eq('invite_code', inviteCode)
        .single();
      if (error) throw error;
      if (!room) throw new Error('Room not found.');
      await client.from('weedopolis_players').insert({ ...player, room_id: room.room_id });
      return room;
    },

    async getRoom(inviteCode) {
      const { data, error } = await client
        .from('weedopolis_rooms')
        .select('*, weedopolis_players(*), weedopolis_game_states(*)')
        .eq('invite_code', inviteCode)
        .single();
      if (error) throw error;
      return data;
    },

    async updatePlayer(playerId, patch) {
      const { data, error } = await client
        .from('weedopolis_players')
        .update(patch)
        .eq('player_id', playerId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async saveState(roomId, statePatch) {
      const { data, error } = await client
        .from('weedopolis_game_states')
        .update(statePatch)
        .eq('room_id', roomId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async appendEvent(event) {
      const { data, error } = await client
        .from('weedopolis_events')
        .insert(event)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    subscribeRoom(roomId, onChange) {
      return client
        .channel(`weedopolis:${roomId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'weedopolis_players', filter: `room_id=eq.${roomId}` }, onChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'weedopolis_game_states', filter: `room_id=eq.${roomId}` }, onChange)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'weedopolis_events', filter: `room_id=eq.${roomId}` }, onChange)
        .subscribe();
    }
  };

  return assertMultiplayerAdapter(adapter);
}
