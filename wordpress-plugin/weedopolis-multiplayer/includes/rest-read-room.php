<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function weedopolis_mp_read_room( WP_REST_Request $request ) {
    global $wpdb;
    $code = sanitize_text_field( $request['code'] );
    $rooms = weedopolis_mp_table( 'rooms' );
    $room = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $rooms WHERE invite_code = %s", $code ), ARRAY_A );

    if ( ! $room ) {
        return new WP_Error( 'weedopolis_room_not_found', 'Room not found.', array( 'status' => 404 ) );
    }

    return rest_ensure_response( array( 'room' => $room ) );
}
