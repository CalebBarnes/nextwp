<?php
// redirect to admin page unless preview
add_action("template_redirect", function() {
    if (!isset($_GET['preview'])) {
        wp_redirect('/wp-admin');
    }
});


// excludes action monitor from search
add_action( 'init', 'set_action_monitor_type_private', 99 );
function set_action_monitor_type_private() {
    global $wp_post_types;

    if ( post_type_exists( 'action_monitor' ) ) {

        // exclude from search results
        $wp_post_types['action_monitor']->public = false;
    }
}