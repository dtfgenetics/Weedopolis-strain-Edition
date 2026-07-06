<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function weedopolis_mp_now() {
    return current_time( 'mysql', true );
}

function weedopolis_mp_code() {
    return strtoupper( substr( wp_generate_password( 10, false, false ), 0, 6 ) );
}

function weedopolis_mp_id( $prefix ) {
    return $prefix . '_' . wp_generate_uuid4();
}

function weedopolis_mp_json( $value ) {
    return wp_json_encode( $value );
}

function weedopolis_mp_read_json( $value ) {
    $decoded = json_decode( $value, true );
    return is_array( $decoded ) ? $decoded : array();
}
