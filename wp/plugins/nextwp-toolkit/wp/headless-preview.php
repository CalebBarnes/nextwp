<?php
/* Load preview iframe template if we are in preview */
add_filter('template_include', 'next_preview_template_include', 1, 1);
function next_preview_template_include($template) {
  if (get_field('headless_preview', 'option')) {
    $is_preview  = is_preview();
    console_log($is_preview);

    if ($is_preview) {
      error_log(plugin_dir_path(__DIR__) . 'includes/preview-template.php');
      return plugin_dir_path(__DIR__) . 'includes/preview-template.php'; //Load your template or file
    }

    return $template;
  } else {
    return $template;
  }
}
?>