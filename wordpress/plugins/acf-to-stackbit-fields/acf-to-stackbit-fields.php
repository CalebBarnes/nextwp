<?php
/**
 * Plugin Name: ACF to Stackbit Fields
 * Description: Provides a REST API endpoint to get ACF field definitions for Stackbit.
 * Version: 1.0
 * Author: Caleb Barnes
 */

add_action('rest_api_init', function () {
  register_rest_route('acf-to-stackbit/v1', '/(?P<postType>[a-zA-Z0-9_-]+)/fields', array(
    'methods' => 'GET',
    'callback' => 'get_acf_field_definitions',
    'args' => array(
      'postType' => array(
        'validate_callback' => function ($param) {
          return post_type_exists($param);
        }
      ),
    ),
  ));
});

function get_acf_field_definitions($request) {
  $post_type = $request['postType'];

  $field_groups = acf_get_field_groups(array('post_type' => $post_type));
  $fields_data = array();

  foreach ($field_groups as $group) {
    $fields = acf_get_fields($group['key']);
    foreach ($fields as $field) {
      // Process each field to structure its data
      $fields_data[] = process_acf_field($field);
    }
    // return new WP_REST_Response($fields, 200);
  }

  $data = [
    'type'  => 'object',
    'name'  => 'acf',
    'label'  => 'Fields',
    'fields' => $fields_data,
  ];

  return new WP_REST_Response($data, 200);
}

function process_acf_field($field) {

    if ($field["type"] === "flexible_content") {
        $layouts = $field["layouts"];
        $layouts_data = array();
        foreach ($layouts as $layout) {
        $sub_fields = $layout["sub_fields"];
        $sub_fields_data = array();
        foreach ($sub_fields as $sub_field) {
            $sub_fields_data[] = process_acf_field($sub_field);
        }
        $layouts_data[] = array(
            'name' => $layout['name'],
            'label' => $layout['label'],
            'type' => 'object',
            'fields' => $sub_fields_data,
            // 'test' => $layout,
        );
        }
        return array(
            'type' => 'list',
            'name' => $field['name'],
            'label' => $field['label'],
            'items' => array(
                'type' => 'object',
                'fields' => $layouts_data,
            )
        );
    }

    if ($field["type"] === "repeater") {
        $sub_fields = $field["sub_fields"];
        $sub_fields_data = array();
        foreach ($sub_fields as $sub_field) {
        $sub_fields_data[] = process_acf_field($sub_field);
        }
        return array(
        'name' => $field['name'],
        'type' => 'list',
        'items' => array(
            'type' => 'object',
            'fields' => array(
                'type' => 'object',
                'fields' => $sub_fields_data,
            )
        ),
        );
    }

    if ($field["type"] === "group") {
        $sub_fields = $field["sub_fields"];
        $sub_fields_data = array();
        foreach ($sub_fields as $sub_field) {
        $sub_fields_data[] = process_acf_field($sub_field);
        }
        return array(
        'name' => $field['name'],
        'type' => $field['type'],
        'sub_fields' => $sub_fields_data,
        );
    }

    if ($field["type"] === "clone") {
        $sub_fields = $field["clone"];
        $sub_fields_data = array();
        foreach ($sub_fields as $sub_field) {
        $sub_fields_data[] = process_acf_field($sub_field);
        }
        return array(
        'name' => $field['name'],
        'type' => $field['type'],
        'sub_fields' => $sub_fields_data,
        );
    }

    if ($field["type"] === "text") {
        return array(
        'name' => $field['name'],
        'label' => $field['label'],
        'type' => 'string',
        );
    }
    if ($field["type"] === "textarea") {
        return array(
        'name' => $field['name'],
        'label' => $field['label'],
        'type' => 'text',
        );
    }
    if ($field["type"] === "link") {
        return array(
        'name' => $field['name'],
        'label' => $field['label'],
        'type' => 'object',
        'fields' => array(
            array(
            'name' => 'url',
            'label' => 'URL',
            'type' => 'string',
            ),
            array(
            'name' => 'title',
            'label' => 'Title',
            'type' => 'string',
            ),
            array(
            'name' => 'target',
            'label' => 'Target',
            'type' => 'string',
            ),
        )
        );
    }

    if ($field["type"] === "select") {
        $options = [];
        foreach ($field["choices"] as $key => $value) {
            $options[] = array(
                'label' => $value,
                'value' => $key,
            );
        }

        return array(
            'name' => $field['name'],
            'label' => $field['label'],
            'type' => 'enum',
            'options' => $options,
        );
    }

    if ($field["type"] === "wysiwyg") {
        return array(
            'name' => $field['name'],
            'label' => $field['label'],
            'type' => 'richText',
        );
    }

return array(
    'name' => $field['name'],
    'label' => $field['label'],
    'type' => $field['type'],
    // Add more properties as needed
  );
}
