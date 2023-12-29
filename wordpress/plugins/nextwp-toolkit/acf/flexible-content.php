<?php

if (function_exists('acf_add_local_field_group')) :

    $modules_post_types = get_field('modules_post_types', 'options');
    $selected_post_types;

    if (!empty($modules_post_types)) {
        foreach ($modules_post_types as $modules_post_select) {
            $selected_post_types[] = array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => $modules_post_select['post_type_choices'],
                )
            );
        }
    }

    $modules_field_location = array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'page',
            ),
            array(
                'param' => 'post_template',
                'operator' => '==',
                'value' => 'default',
            ),
        ),
    );

    if (isset($selected_post_types)) {
        $modules_field_location = array_merge($modules_field_location, $selected_post_types);
    }

    $layouts = [];

    // Get all modules
    $modules = acf_get_field_groups();

    foreach ($modules as $module) :

        $title = $module['title'];

        if (strpos($title, 'Module: ') !== false) :

            $title = str_replace('Module: ', '', $title);

            $key = $module['key'];

            // Generate slug from title
            $slug = strtolower(preg_replace('/[^\w-]+/', '-', $title));

            $layouts[$key] = [
                'key' => $key,
                'label' => $title,
                'name' => $slug,
                'display' => 'block',
                'sub_fields' => array(
                    array(
                        'key' => $key,
                        'label' => $title,
                        'name' => $slug,
                        'type' => 'clone',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array(
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'clone' => array(
                            0 => $key,
                        ),
                        'style' => 'seamless',
                        'layout' => 'block',
                        'prefix_label' => 0,
                        'prefix_name' => 0,
                    ),
                ),
                'min' => '',
                'max' => '',
            ];
        endif;

    endforeach;

    // Create flexible content area 'modules'

    acf_add_local_field_group(array(
        'key' => 'group_5a78f47055572',
        'title' => 'Modules',
        'fields' => array(
            array(
                'key' => 'field_5a78f4f7e90a0',
                'label' => 'Modules',
                'name' => 'modules',
                'type' => 'flexible_content',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'layouts' => $layouts,
                'button_label' => 'Add Content',
                'min' => '',
                'max' => '',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ),
                array(
                    'param' => 'post_type',
                    'operator' => '!=',
                    'value' => 'page',
                ),
            ),
        ),
        'menu_order' => -999,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => 1,
        'description' => '',
    ));


    // Display flexible content area 'modules' on default template

    acf_add_local_field_group(array(
        'key' => 'group_5a8486cf51136',
        'title' => 'acf',
        'fields' => array(
            array(
                'key' => 'field_5a84871978f88',
                'label' => 'Content',
                'name' => 'flexible_content',
                'type' => 'clone',
                'instructions' => '',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'clone' => array(
                    0 => 'field_5a78f4f7e90a0',
                ),

                'layout' => 'block',
                'prefix_label' => 0,
                'prefix_name' => 0,
            ),
        ),
        'location' => $modules_field_location,
        'menu_order' => -1,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'style' => 'seamless',
        'hide_on_screen' => array(
            0 => 'the_content',
            // 1 => 'excerpt',
            // 2 => 'custom_fields',
            // 3 => 'discussion',
            // 4 => 'comments',
            // 5 => 'revisions',
            // 6 => 'slug',
            // 7 => 'author',
            // 8 => 'format',
            // 9 => 'featured_image',
            // 10 => 'categories',
            // 11 => 'tags',
            // 12 => 'send-trackbacks',
        ),
        'active' => 1,
        'description' => '',
        'show_in_graphql'                       => true,
        'show_in_rest'                          => true,
        'graphql_field_name'                    => 'acf',
        'map_graphql_types_from_location_rules' => true,
        'graphql_types'                         => ['DefaultTemplate']
    ));

endif;
