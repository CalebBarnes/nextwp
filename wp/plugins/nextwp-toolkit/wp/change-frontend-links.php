<?php

$frontend_url = get_field('nextwp_frontend_url', 'options');

if($frontend_url){
  function custom_frontend_url( $permalink, $post ) {
    $frontend_url = get_field('nextwp_frontend_url', 'options');

    // remove trailing slash
    if(substr($frontend_url, -1) == '/') {
      $frontend_url = substr($frontend_url, 0, -1);
    }
    
    $custom_permalink = str_replace(home_url(), $frontend_url, $permalink);
    
    return $custom_permalink; 
  }; 
        
  add_filter( 'page_link', 'custom_frontend_url', 10, 2 ); 
  add_filter( 'post_link', 'custom_frontend_url', 10, 2 );
  add_filter( 'post_type_link', 'custom_frontend_url', 10, 2 ); 
}
