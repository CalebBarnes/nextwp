<?php
if (function_exists('acf_add_options_page')) :

  acf_add_options_page(array(
    'page_title'   => 'NextWP',
    'menu_title'  => 'NextWP',
    'menu_slug'   => 'nextwp',
    'capability'  => 'edit_posts',
    'icon_url' => 'dashicons-editor-code',
    'position' => 2,
    'redirect'    => false
  ));

  acf_add_options_page(array(
    'page_title'   => 'Theme Options',
    'menu_title'  => 'Theme Options',
    'menu_slug'   => 'theme-options',
    'capability'  => 'edit_posts',
    'icon_url' => 'dashicons-admin-customizer',
    'position' => 2,
    'redirect'    => false,
    'show_in_graphql' => true
  ));

endif;


if (function_exists('acf_add_local_field_group')) :
  acf_add_local_field_group(array(
    'key' => 'group_1',
    'title' => 'Headless Features',
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
        'default_value' => 'http://localhost:3000/',
        'placeholder' => '',
        'instructions' => 'The URL of your headless frontend. The preview mode will add /preview to the end of this.',
      ),

      array(
        'key' => 'field_63dac3a7bal85',
        'label' => 'Preview Secret',
        'name' => 'preview_secret',
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
        'default_value' => 'my-preview-secret',
        'placeholder' => '',
        'instructions' => 'The secret used for entering preview mode. This should match the env NEXT_PREVIEW_SECRET in your Next.js App.',
      ),

      array(
        'key' => 'headless_preview',
        'label' => 'Headless Preview',
        'instructions' => 'Enable preview mode for headless WordPress',
        'name' => 'headless_preview',
        'type' => 'true_false',
        'message' => 'Enabled'
      ),



      array(
        'key' => 'decapitate_wp',
        'label' => 'Decapitate WP',
        'instructions' => 'Remove old frontend of WordPress',
        'name' => 'decapitate_wp',
        'type' => 'true_false',
        'message' => 'Enabled'
      ),

      array(
        'key' => 'flexible_content',
        'label' => 'Flexible Content',
        'instructions' => 'Auto add elements with title "Module: (...)" to flexible content section on default page template',
        'name' => 'flexible_content',
        'type' => 'true_false',
        'message' => 'Enabled'
      ),
      array(
        'key' => 'field_623cd145eee11',
        'label' => 'Modules Post Types',
        'name' => 'modules_post_types',
        'type' => 'repeater',
        'instructions' => 'Additional post types to add the Modules field group to.',
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
        'key' => 'menu_locations',
        'label' => 'Additional Menu Locations',
        'name' => 'menu_locations',
        'type' => 'repeater',
        'instructions' => 'Add menu locations here (required to show menus in GraphQL)',
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
        'instructions' => 'The Google Maps API Key to use for the Google Maps field type in ACF. May also be used in the headless app.',
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

endif;
