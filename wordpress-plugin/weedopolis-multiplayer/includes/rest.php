<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once WEEDOPOLIS_MP_PATH . 'includes/rest-create-room.php';
require_once WEEDOPOLIS_MP_PATH . 'includes/rest-join-room.php';
require_once WEEDOPOLIS_MP_PATH . 'includes/rest-read-room.php';
require_once WEEDOPOLIS_MP_PATH . 'includes/rest-update-state.php';

function weedopolis_mp_register_routes() {
    register_rest_route( 'weedopolis/v1', '/rooms', array(
        'methods'             => 'POST',
        'callback'            => 'weedopolis_mp_create_room',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( 'weedopolis/v1', '/rooms/(?P<code>[A-Z0-9]+)/join', array(
        'methods'             => 'POST',
        'callback'            => 'weedopolis_mp_join_room',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( 'weedopolis/v1', '/rooms/(?P<code>[A-Z0-9]+)', array(
        'methods'             => 'GET',
        'callback'            => 'weedopolis_mp_read_room',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( 'weedopolis/v1', '/rooms/(?P<room_id>[a-zA-Z0-9_-]+)/state', array(
        'methods'             => 'POST',
        'callback'            => 'weedopolis_mp_update_state',
        'permission_callback' => '__return_true',
    ) );
}
