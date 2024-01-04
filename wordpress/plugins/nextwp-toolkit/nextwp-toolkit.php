<?php
/*
* Plugin Name: NextWP - Headless Toolkit
* Plugin URI: https://github.com/CalebBarnes/nextwp/@nextwp/wp-plugin
* Description: A toolkit for headless Wordpress sites built with NextWP
* Version: 1.0.1
* Author: Caleb Barnes
* Author URI: https://github.com/CalebBarnes
*/

add_action('acf/init', 'nextwp_acf_init');

function nextwp_acf_init() {
  if (class_exists('acf')) {
    include_once('acf/options-page.php');

    if (get_field('flexible_content', 'options')) :
      include_once('acf/flexible-content.php');
    endif;

    if (get_field('decapitate_wp', 'options')) :
      include_once('wp/decapitate-wp.php');
    endif;

    if (have_rows('menu_locations', 'options')) :
      include_once('wp/add-menu-locations.php');
    endif;
  }
}

include_once('wp/rest-endpoint-options-page.php');
include_once('wp/rest-menu-items-add-acf.php');
include_once('wp/headless-preview.php');
include_once('acf/populate-post-type-choices.php');
include_once('wp/customizer-iframe-preview.php');

require_once(plugin_dir_path(__FILE__) . 'includes/console_log.php');

add_action('init', 'handle_preflight');
function handle_preflight() {
    // This is for CORS when using the WP REST API, especially when submitting Gravity Forms
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

    if('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
}

function nextwp_acf_google_map_api( $api ){
  $apiKey = get_field('nextwp_google_maps_api_key', 'options');
  if ($apiKey) {
    $api['key'] = $apiKey;
  }
  return $api;
}
add_filter('acf/fields/google_map/api', 'nextwp_acf_google_map_api');


add_filter( 'rest_prepare_revision', function( $response, $post ) {
  $data = $response->get_data();

  $data['acf'] = get_fields( $post->ID );
  
  return rest_ensure_response( $data );
}, 10, 2 );