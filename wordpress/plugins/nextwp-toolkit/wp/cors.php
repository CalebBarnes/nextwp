<?php

add_action('init', 'handle_preflight');
function handle_preflight()
{
    // This is for CORS when using the WP REST API, especially when submitting Gravity Forms
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");


    if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
        // Check for CORS preflight request headers
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) || isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
            // It's a CORS preflight request, handle accordingly
            status_header(200);
            exit();
        }
        // Not a preflight request, let WordPress handle it (possibly a schema request)
    }
}
