<?php
function nextwp_admin_menu_icon_css() {
  ?>
  <style>
    #adminmenu .toplevel_page_nextwp div.wp-menu-image img {
      height: 20px;
      margin-top: -2px;
    } 
  </style>
  <?php
}
add_action('admin_head', 'nextwp_admin_menu_icon_css');

if (function_exists('acf_add_options_page')) :

  acf_add_options_page(array(
    'page_title'   => 'NextWP Toolkit',
    'menu_title'  => 'NextWP',
    'menu_slug'   => 'nextwp',
    'capability'  => 'edit_posts',
    'icon_url' => 'https://www.nextwp.org/icon.png',
    'position' => 98,
    'redirect'    => false
  ));


  acf_add_options_sub_page(array(
    'page_title'   => 'NextWP Toolkit - ACF Utilities',
    'menu_title'  => 'ACF',
    'menu_slug'   => 'nextwp-flexible-content',
    'parent_slug' => 'nextwp',
  ));


endif;


if (function_exists('acf_add_local_field_group')) :
  acf_add_local_field_group(array(
    'key' => 'group_1',
    'title' => 'Settings',
    'fields' => array(
      array(
        'key' => 'field_63dac3a7baf64',
        'label' => 'Frontend URL',
        'name' => 'nextwp_frontend_url',
        'aria-label' => '',
        'type' => 'url',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
          'width' => '',
          'class' => '',
          'id' => '',
        ),
        'default_value' => 'http://localhost:3000',
        'placeholder' => '',
        'instructions' => 'The URL of your Next.js frontend. The preview mode will use this for the preview iframe.',
      ),

      array(
        'key' => 'field_63dac3a7bal85',
        'label' => 'Preview Secret',
        'name' => 'nextwp_preview_secret',
        'aria-label' => '',
        'type' => 'text',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
          'width' => '',
          'class' => '',
          'id' => '',
        ),
        'default_value' => '',
        'placeholder' => '',
        'instructions' => 'The secret used for entering preview mode. This should match the env NEXT_PREVIEW_SECRET in your NextWP project.',
      ),

      array(
        'key' => 'headless_preview',
        'label' => 'Headless Preview',
        'instructions' => 'Enable preview mode for <a href="https://www.nextwp.org/" target="_blank">NextWP</a>.',
        'name' => 'headless_preview',
        'type' => 'true_false',
        'message' => 'Enabled'
      ),

      array(
        'key' => 'decapitate_wp',
        'label' => 'Decapitate WP',
        'instructions' => 'Remove the default frontend of WordPress',
        'name' => 'decapitate_wp',
        'type' => 'true_false',
        'message' => 'Enabled'
      ),

      array(
        'key' => 'menu_locations',
        'label' => 'Additional Menu Locations',
        'name' => 'menu_locations',
        'type' => 'repeater',
        'instructions' => 'Add additional menu locations if needed.',
        'show_in_graphql' => 1,
        'layout' => 'block',
        'button_label' => 'Add Menu Location',
        'sub_fields' => array(
          array(
            'key' => 'menu_location_name',
            'label' => 'Name',
            'name' => 'menu_location_name',
            'type' => 'text',
            'required' => 1,
            'show_in_graphql' => 1,
            'wrapper' => array(
              'width' => '50%',
            ),
          ),
          array(
            'key' => 'menu_location_slug',
            'label' => 'Slug',
            'name' => 'menu_location_slug',
            'type' => 'text',
            'required' => 1,
            'show_in_graphql' => 1,
            'wrapper' => array(
              'width' => '50%',
            ),
          ),
        ),
      ),
    ),
    'location' => array(
      array(
        array(
          'param' => 'options_page',
          'operator' => '==',
          'value' => 'nextwp',
        ),
      ),
    ),
    'menu_order' => 1,
    'style' => 'default',
  ));


  acf_add_local_field_group(array(
    'key' => 'nextwp_group_2',
    'title' => 'ACF Utilities',
    'fields' => array(

      array(
        'key' => 'flexible_content',
        'label' => 'Clone Flexible Content Blocks',
        'instructions' => 'Clones field groups with title "Module: (...)" to a flexible content field group on the default page template. <br/>Read more about using ACF Flexible Content in NextWP <a href="https://www.nextwp.org/packages/nextwp/core/components#flexible-content" target="_blank">here</a>.',
        'name' => 'flexible_content',
        'type' => 'true_false',
        'message' => 'Enabled'
      ),
      array(
        'key' => 'field_623cd145eee11',
        'label' => 'Flexible Content Post Types',
        'name' => 'modules_post_types',
        'type' => 'repeater',
        'instructions' => 'Additional post types to add this ACF Flexible Content field group to.',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
          'width' => '',
          'class' => '',
          'id' => '',
        ),
        'show_in_graphql' => 1,
        'collapsed' => '',
        'min' => 0,
        'max' => 0,
        'layout' => 'table',
        'button_label' => '',
        'sub_fields' => array(
          array(
            'key' => 'field_623cd16deee12',
            'label' => 'Post Type',
            'name' => 'post_type_choices',
            'type' => 'select',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => array(
              'width' => '',
              'class' => '',
              'id' => '',
            ),
            'show_in_graphql' => 1,
            'choices' => array(),
            'default_value' => false,
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 0,
            'return_format' => 'value',
            'ajax' => 0,
            'placeholder' => '',
          ),
        ),
      ),

      array(
        'key' => 'nextwp_google_maps_api_key',
        'label' => 'Google Maps API Key',
        'name' => 'nextwp_google_maps_api_key',
        'aria-label' => '',
        'type' => 'text',
        'instructions' => '',
        'required' => 0,
        'conditional_logic' => 0,
        'wrapper' => array(
          'width' => '',
          'class' => '',
          'id' => '',
        ),
        'default_value' => false,
        'placeholder' => '',
        'instructions' => 'The Google Maps API Key to use for the Google Maps field type in ACF. This value can also be used in a NextWP project with the <a href="https://www.nextwp.org/packages/nextwp/core/functions#get-options-page" target="_blank">getOptionsPage</a> function.',
      ),

    ),
    'location' => array(
      array(
        array(
          'param' => 'options_page',
          'operator' => '==',
          'value' => 'nextwp-flexible-content',
        ),
      ),
    ),
    'menu_order' => 1,
    'style' => 'default',
  ));

endif;
