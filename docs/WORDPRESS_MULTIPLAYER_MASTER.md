# Weedopolis WordPress Multiplayer Master

Goal: run online invites inside the existing WordPress website without Supabase or another paid external realtime service.

## Chosen free approach

Use WordPress as the room server:

- WordPress REST API endpoints
- WordPress MySQL database tables
- browser polling every 1 to 2 seconds
- player reconnect tokens stored in browser local storage

This is correct for a turn-based board game. It does not need WebSockets for the first production version.

## Why this replaces Supabase

Supabase is no longer the preferred first provider. The current preferred provider is WordPress because it lives inside the existing DTF Seeds site and uses the hosting/database already available.

## Required WordPress pieces

- small custom plugin
- custom REST namespace: `weedopolis/v1`
- custom tables for rooms, players, game states, and events
- public create/join/read endpoints with room-token checks
- turn-action endpoint with state version checks
- cleanup for expired rooms

## Required browser flow

1. Host clicks Create Online Game.
2. Browser calls WordPress REST endpoint to create a room.
3. WordPress stores the room and initial game state.
4. Browser shows invite URL with `?game=CODE`.
5. Guest opens the URL.
6. Browser calls join endpoint.
7. Both browsers poll room state.
8. Only valid turn actions update game state.
9. Each update increments state version.
10. Refresh/reconnect uses stored player id and player token.

## Endpoints needed

- `POST /wp-json/weedopolis/v1/rooms`
- `POST /wp-json/weedopolis/v1/rooms/{code}/join`
- `GET /wp-json/weedopolis/v1/rooms/{code}`
- `POST /wp-json/weedopolis/v1/rooms/{code}/player`
- `POST /wp-json/weedopolis/v1/rooms/{code}/action`
- `GET /wp-json/weedopolis/v1/rooms/{code}/events`

## Important limitation

Polling is not instant realtime, but it is free, WordPress-native, and good enough for a Monopoly-style turn-based game.
