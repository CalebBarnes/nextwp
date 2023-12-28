<?php
/**
 * Add ACF fields to menu items in the REST API
 */
add_filter("rest_pre_echo_response", function($result, $server, $request){
    $route = $request->get_route();
  
    if ($route == "/wp/v2/menu-items") {
      $result = array_map(function($item){
        $fields = get_fields($item["id"]);
        if ($fields){
          $item['acf'] = $fields;
        }
        return $item;
      }, $result);
    }
  
    return $result;
  }, 10, 3);

?>