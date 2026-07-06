<?php
/**
 * Plugin Name: Weedopolis Multiplayer
 * Description: WordPress-native online room server for Weedopolis.
 * Version: 0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'WEEDOPOLIS_MP_VERSION', '0.1.0' );
define( 'WEEDOPOLIS_MP_PATH', plugin_dir_path( __FILE__ ) );

require_once WEEDOPOLIS_MP_PATH . 'includes/schema.php';
require_once WEEDOPOLIS_MP_PATH . 'includes/rest.php';

register_activation_hook( __FILE__, 'weedopolis_mp_install_tables' );
add_action( 'rest_api_init', 'weedopolis_mp_register_routes' );
