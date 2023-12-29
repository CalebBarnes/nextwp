<?php
/**
 * Loads a script on the Customizer page,
 * which will replace the iframe src with the headless site url
 */
function my_customizer_enqueue_script() {
    wp_enqueue_script( 'customizer-headless-preview', plugin_dir_url(__FILE__) . 'js/customizer-iframe.js', array( 'jquery', 'customize-preview' ), '', true );
    $headless_site_url = get_field("nextwp_frontend_url", "option");
    wp_localize_script( 'customizer-headless-preview', 'customizerData', array(
        'headlessUrl' => $headless_site_url
    ));
}
add_action( 'customize_controls_enqueue_scripts', 'my_customizer_enqueue_script' ); 
?>