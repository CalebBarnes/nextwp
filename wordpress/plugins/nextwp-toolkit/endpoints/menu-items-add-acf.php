<?php

/**
 * Add ACF fields to menu items in the REST API
 */
add_filter("rest_pre_echo_response", function ($result, $server, $request) {
  $route = $request->get_route();

  if ($route == "/wp/v2/menu-items") {
    if (isset($result["code"])) { // example: "code": "rest_cannot_view"
      return $result;
    }
    if (!class_exists('ACF')) { // ACF is not installed
      return $result;
    }

    $result = array_map(function ($item) {
      if (!isset($item["id"])) {
        return $item;
      }
      $fields = get_fields($item["id"]);
      if ($fields) {
        $item['acf'] = $fields;
      }
      return $item;
    }, $result);
  }

  return $result;
}, 10, 3);
