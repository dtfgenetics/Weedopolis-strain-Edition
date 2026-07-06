# Weedopolis Online Multiplayer Setup

## Provider

First production provider: Supabase realtime.

## Do not commit secrets

Do not commit service-role keys or private database passwords.

The browser app may use a public anon key only when Supabase row policies are configured correctly.

## Required website config

Before mounting the online game, the website must define:

```html
<script>
window.WEEDOPOLIS_MULTIPLAYER = {
  provider: 'supabase',
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR_PUBLIC_ANON_KEY'
};
</script>
```

## Required database setup

Run:

```bash
supabase/weedopolis_multiplayer.sql
```

Required tables:

- weedopolis_rooms
- weedopolis_players
- weedopolis_game_states
- weedopolis_events

## Required app flow

- Create Online Game calls `createOnlineController(...).createRoom()`.
- Invite URL uses the stored room invite code.
- Join Online Game calls `joinByCode()`.
- Game page calls `loadRoom()` on page load.
- Clients call `subscribe()` for live updates.
- Every turn action calls `saveGameState()` and `logEvent()`.
