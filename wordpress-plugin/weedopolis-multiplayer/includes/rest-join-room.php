<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function weedopolis_mp_join_room( WP_REST_Request $request ) {
    global $wpdb;
    $code = sanitize_text_field( $request['code'] );
    $body = $request->get_json_params();
    $name = sanitize_text_field( $body['player']['display_name'] ?? $body['player']['name'] ?? 'Player' );
    $rooms = weedopolis_mp_table( 'rooms' );
    $room = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $rooms WHERE invite_code = %s", $code ), ARRAY_A );

    if ( ! $room ) {
        return new WP_Error( 'weedopolis_room_not_found', 'Room not found.', array( 'status' => 404 ) );
    }

    $player_id = weedopolis_mp_id( 'p' );
    $player_token = wp_generate_password( 32, false, false );
    $wpdb->insert( weedopolis_mp_table( 'players' ), array(
        'player_id' => $player_id,
        'room_id' => $room['room_id'],
        'display_name' => $name,
        'player_token' => $player_token,
        'is_host' => 0,
        'ready' => 0,
        'connected' => 1,
        'last_seen_at' => weedopolis_mp_now(),
    ) );

    return rest_ensure_response( array(
        'room' => $room,
        'player' => array( 'player_id' => $player_id, 'player_token' => $player_token ),
    ) );
}
