<?php

function nextwp_register_menu_locations() {

    $array = array();

    if(have_rows( 'menu_locations', 'options')):
        while( have_rows('menu_locations', 'options') ): the_row();
            $name = get_sub_field('menu_location_name');
            $slug = get_sub_field('menu_location_slug');

            $array[$slug] = $name;

        endwhile;
    endif;

    register_nav_menus($array);
}

add_action( 'init', 'nextwp_register_menu_locations' );


?>