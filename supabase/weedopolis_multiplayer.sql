create table if not exists weedopolis_rooms (
  room_id text primary key,
  invite_code text unique not null,
  invite_url text not null,
  host_player_id text,
  status text not null default 'lobby',
  max_players int not null default 6,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists weedopolis_players (
  player_id text primary key,
  room_id text not null references weedopolis_rooms(room_id) on delete cascade,
  display_name text not null,
  token text,
  color text,
  is_host boolean not null default false,
  ready boolean not null default false,
  connected boolean not null default true,
  last_seen_at timestamptz not null default now()
);

create table if not exists weedopolis_game_states (
  room_id text primary key references weedopolis_rooms(room_id) on delete cascade,
  state_version int not null default 1,
  phase text not null default 'lobby',
  current_player_id text,
  state_json jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists weedopolis_events (
  event_id text primary key,
  room_id text not null references weedopolis_rooms(room_id) on delete cascade,
  player_id text,
  event_type text not null,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists weedopolis_players_room_id_idx on weedopolis_players(room_id);
create index if not exists weedopolis_events_room_id_idx on weedopolis_events(room_id);
