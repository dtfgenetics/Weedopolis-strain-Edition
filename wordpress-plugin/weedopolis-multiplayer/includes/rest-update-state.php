<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function weedopolis_mp_update_state( WP_REST_Request $request ) {
    global $wpdb;
    $room_id = sanitize_text_field( $request['room_id'] );
    $body = $request->get_json_params();
    $states = weedopolis_mp_table( 'game_states' );
    $current = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $states WHERE room_id = %s", $room_id ), ARRAY_A );

    if ( ! $current ) {
        return new WP_Error( 'weedopolis_state_not_found', 'Game state not found.', array( 'status' => 404 ) );
    }

    $next_version = intval( $current['state_version'] ) + 1;
    $phase = sanitize_text_field( $body['phase'] ?? $current['phase'] );
    $state_json = weedopolis_mp_json( $body['state_json'] ?? array() );

    $wpdb->update( $states, array(
        'state_version' => $next_version,
        'phase' => $phase,
        'state_json' => $state_json,
        'updated_at' => weedopolis_mp_now(),
    ), array( 'room_id' => $room_id ) );

    return rest_ensure_response( array(
        'room_id' => $room_id,
        'state_version' => $next_version,
        'phase' => $phase,
    ) );
}
