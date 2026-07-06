<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function weedopolis_mp_create_room( WP_REST_Request $request ) {
    global $wpdb;
    $body = $request->get_json_params();
    $code = weedopolis_mp_code();
    $room_id = 'room_' . strtolower( $code );
    $now = weedopolis_mp_now();
    $host_name = sanitize_text_field( $body['hostName'] ?? 'Host' );
    $host_id = weedopolis_mp_id( 'p' );
    $player_token = wp_generate_password( 32, false, false );
    $invite_url = esc_url_raw( $body['baseUrl'] ?? home_url( '/games/weedopolis/' ) ) . '?game=' . $code;

    $room = array(
        'room_id' => $room_id,
        'invite_code' => $code,
        'invite_url' => $invite_url,
        'host_player_id' => $host_id,
        'status' => 'lobby',
        'max_players' => 6,
        'created_at' => $now,
        'updated_at' => $now,
    );

    $wpdb->insert( weedopolis_mp_table( 'rooms' ), $room );
    $wpdb->insert( weedopolis_mp_table( 'players' ), array(
        'player_id' => $host_id,
        'room_id' => $room_id,
        'display_name' => $host_name,
        'player_token' => $player_token,
        'is_host' => 1,
        'ready' => 0,
        'connected' => 1,
        'last_seen_at' => $now,
    ) );
    $wpdb->insert( weedopolis_mp_table( 'game_states' ), array(
        'room_id' => $room_id,
        'state_version' => 1,
        'phase' => 'lobby',
        'current_player_id' => '',
        'state_json' => weedopolis_mp_json( array( 'phase' => 'lobby', 'players' => array() ) ),
        'updated_at' => $now,
    ) );

    return rest_ensure_response( array(
        'room' => $room,
        'player' => array( 'player_id' => $host_id, 'player_token' => $player_token ),
    ) );
}
