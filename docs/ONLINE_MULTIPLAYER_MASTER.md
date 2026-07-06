# Weedopolis Online Multiplayer Master

Goal: make online invite multiplayer real, not a local-only link.

## Required online flow

1. Host creates an online room.
2. Server stores the room by invite code.
3. Host receives a shareable invite URL.
4. Guest opens the invite URL.
5. Guest joins the same stored room.
6. All clients receive room updates.
7. Host starts the game after players are ready.
8. Only the active player can take turn actions.
9. Every action writes a new game state version.
10. Disconnected players can reconnect by room code and player id.

## Required backend capability

The website needs one realtime provider for:

- room storage
- player storage
- game state storage
- action log storage
- realtime subscriptions
- reconnect support
- stale room cleanup

## Recommended first provider

Use Supabase for the first production-ready adapter because it provides hosted Postgres, row storage, auth-compatible policies, and realtime subscriptions for a static or hosted web app.

## Required room fields

- room_id
- invite_code
- invite_url
- host_player_id
- status
- max_players
- created_at
- updated_at
- expires_at

## Required player fields

- player_id
- room_id
- display_name
- token
- color
- is_host
- ready
- connected
- last_seen_at

## Required game state fields

- room_id
- state_version
- phase
- current_player_id
- state_json
- updated_at

## Required event fields

- event_id
- room_id
- player_id
- event_type
- payload_json
- created_at

## Non-negotiable rule

An invite link is not multiplayer unless it loads the same server-stored room for every player.
