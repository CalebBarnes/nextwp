<?php
// Includes the ACF fields in the REST API response for post revisions
add_filter( 'rest_prepare_revision', function( $response, $post ) {
    $data = $response->get_data();
  
    $data['acf'] = get_fields( $post->ID );
    
    return rest_ensure_response( $data );
  }, 10, 2 );