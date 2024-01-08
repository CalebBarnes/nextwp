<?php

/**
 * Register a REST route to get the acf json
 * @example: /wp-json/nextwp/v1/acf-json
 */
add_action('rest_api_init', function () {
  register_rest_route('nextwp/v1', '/acf-json', array(
    'methods' => ['GET', 'POST'],
    'callback' => 'nextwp_get_acf_json',
    'permission_callback' => function (WP_REST_Request $request) {
      return current_user_can('administrator');
    }
  ));
});

function nextwp_get_acf_json($request)
{
  $path = NEXTWP_TOOLKIT_PLUGIN_DIR_PATH . '/acf-json';

  if ($request->get_method()  === 'GET') {
    $files = scandir($path);
    $json = [];

    foreach ($files as $file) {
      if (strpos($file, '.json') !== false) {
        $json[$file] = json_decode(file_get_contents($path . '/' . $file));
      }
    }
    return new WP_REST_Response($json, 200);
  }

  if ($request->get_method()  === 'POST') {
    $body = $request->get_body();

    if (empty($body)) {
      return new WP_REST_Response(["error" => "Body is empty"], 400);
    }

    $json = json_decode($body);

    if (empty($json)) {
      return new WP_REST_Response(["error" => "Body is not a valid json"], 400);
    }

    // loop through the json and save the files
    foreach ($json as $key => $value) {
      $filename = $path . '/' . $key;
      $file = fopen($filename, 'w');
      fwrite($file, json_encode($value));
      fclose($file);
      chmod($filename, 0644);
      chmod($path, 0755);
    }

    return new WP_REST_Response($json, 200);
  }

  return new WP_REST_Response(["error" => "Method not allowed"], 405);
}
