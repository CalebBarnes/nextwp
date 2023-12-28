<?php
/**
 * Register a REST route to get the fields for an options page by slug.
 * @example: /wp-json/nextwp/v1/options/theme-options
 */
add_action('rest_api_init', function () {
    register_rest_route('nextwp/v1', '/options/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'nextwp_get_acf_options_page',
        'permission_callback' => function (WP_REST_Request $request) {
            return current_user_can('administrator');
        }
    ));
  });
  
  function nextwp_get_acf_options_page($request) {
    $options_pages = acf_get_options_pages();
    $slug = $request['slug'];
  
    $options_page = $options_pages[$slug];
    
    if (!$options_page) {
      return new WP_Error('not_found', 'Options page not found', array('status' => 404));
    }
    
    // Fetch the fields for the found options page
    $fields = get_fields($options_page["post_id"]);
  
    return $fields ?: new WP_Error('no_fields', 'No fields found for this options page', array('status' => 404));
  }
  ?>