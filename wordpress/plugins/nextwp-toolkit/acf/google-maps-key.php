<?php

function nextwp_acf_google_map_api( $api ){
    $apiKey = get_field('nextwp_google_maps_api_key', 'options');
    if ($apiKey) {
      $api['key'] = $apiKey;
    }
    return $api;
  }
  add_filter('acf/fields/google_map/api', 'nextwp_acf_google_map_api');
  