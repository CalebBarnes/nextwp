<?php

add_action('init', 'handle_preflight');
function handle_preflight() {
    // This is for CORS when using the WP REST API, especially when submitting Gravity Forms
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

    if('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
}