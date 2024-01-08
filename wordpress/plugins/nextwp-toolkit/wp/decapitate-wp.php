<?php
// redirect to admin page unless preview
add_action("template_redirect", function() {
    if (!isset($_GET['preview'])) {
        wp_redirect('/wp-admin');
    }
});
