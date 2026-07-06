<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function weedopolis_mp_table( $name ) {
    global $wpdb;
    return $wpdb->prefix . 'weedopolis_' . $name;
}

function weedopolis_mp_install_tables() {
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $charset = $wpdb->get_charset_collate();

    $rooms = weedopolis_mp_table( 'rooms' );
    $players = weedopolis_mp_table( 'players' );
    $states = weedopolis_mp_table( 'game_states' );
    $events = weedopolis_mp_table( 'events' );

    dbDelta( "CREATE TABLE $rooms (
        room_id varchar(64) NOT NULL,
        invite_code varchar(16) NOT NULL,
        invite_url text NOT NULL,
        host_player_id varchar(64) DEFAULT '',
        status varchar(24) NOT NULL DEFAULT 'lobby',
        max_players int NOT NULL DEFAULT 6,
        created_at datetime NOT NULL,
        updated_at datetime NOT NULL,
        expires_at datetime DEFAULT NULL,
        PRIMARY KEY  (room_id),
        UNIQUE KEY invite_code (invite_code)
    ) $charset;" );

    dbDelta( "CREATE TABLE $players (
        player_id varchar(64) NOT NULL,
        room_id varchar(64) NOT NULL,
        display_name varchar(120) NOT NULL,
        player_token varchar(128) NOT NULL,
        token varchar(64) DEFAULT '',
        color varchar(32) DEFAULT '',
        is_host tinyint(1) NOT NULL DEFAULT 0,
        ready tinyint(1) NOT NULL DEFAULT 0,
        connected tinyint(1) NOT NULL DEFAULT 1,
        last_seen_at datetime NOT NULL,
        PRIMARY KEY  (player_id),
        KEY room_id (room_id)
    ) $charset;" );

    dbDelta( "CREATE TABLE $states (
        room_id varchar(64) NOT NULL,
        state_version int NOT NULL DEFAULT 1,
        phase varchar(64) NOT NULL DEFAULT 'lobby',
        current_player_id varchar(64) DEFAULT '',
        state_json longtext NOT NULL,
        updated_at datetime NOT NULL,
        PRIMARY KEY  (room_id)
    ) $charset;" );

    dbDelta( "CREATE TABLE $events (
        event_id varchar(64) NOT NULL,
        room_id varchar(64) NOT NULL,
        player_id varchar(64) DEFAULT '',
        event_type varchar(64) NOT NULL,
        payload_json longtext NOT NULL,
        created_at datetime NOT NULL,
        PRIMARY KEY  (event_id),
        KEY room_id (room_id)
    ) $charset;" );
}
