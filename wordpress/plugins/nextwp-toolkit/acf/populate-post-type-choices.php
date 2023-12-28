<?php
/**
 * Populate post type choices dropdown in the NextWP options page with all the post types
 */
add_filter("acf/prepare_field/name=post_type_choices", "acf_populate_post_type_choices", 999, 1);

function acf_populate_post_type_choices($field) {
  // reset choices
  $field['choices'] = array();

  $post_types = get_post_types(array('show_in_nav_menus' => true), 'objects');

  foreach ($post_types as $post_type) {
    $field['choices'][$post_type->name] = $post_type->label . " (" . $post_type->name . ")";
  }
  return $field;
}
?>