<?php
/*
* Plugin Name: NextWP - Headless Toolkit
* Plugin URI: https://github.com/CalebBarnes/nextwp/@nextwp/wp-plugin
* Description: A toolkit for headless Wordpress sites built with NextWP
* Version: 1.1.1
* Author: Caleb Barnes
* Author URI: https://github.com/CalebBarnes
*/

add_action('acf/init', 'nextwp_acf_init');

function nextwp_acf_init()
{
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

include_once('endpoints/rest-endpoint-options-page.php');
include_once('endpoints/menu-items-add-acf.php');
include_once('endpoints/rest-endpoint-acf-json.php');

include_once('wp/headless-preview.php');
include_once('acf/populate-post-type-choices.php');
include_once('wp/customizer-iframe-preview.php');
include_once('wp/cors.php');
include_once('acf/google-maps-key.php');
include_once('acf/acf-prepare-revision.php');
include_once('includes/headless-templates.php');


define('NEXTWP_TOOLKIT_PLUGIN_DIR_PATH', untrailingslashit(plugin_dir_path(__FILE__)));

add_filter('acf/settings/save_json', 'nextwp_acf_json_save_point');
function nextwp_acf_json_save_point($path)
{
  $path = NEXTWP_TOOLKIT_PLUGIN_DIR_PATH . '/acf-json';
  return $path;
}

add_filter('acf/settings/load_json', 'my_acf_json_load_point');
/**
 * Register the path to load the ACF json files so that they are version controlled.
 * @param $paths The default relative path to the folder where ACF saves the files.
 * @return string The new relative path to the folder where we are saving the files.
 */
function my_acf_json_load_point($paths)
{
  // Remove original path
  unset($paths[0]);
  // Append our new path
  $paths[] = NEXTWP_TOOLKIT_PLUGIN_DIR_PATH . '/acf-json';
  return $paths;
}
