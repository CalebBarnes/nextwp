<?php

add_action('tgmpa_register', 'nextwp_headless_theme_register_required_plugins');

/**
 * Register the required plugins for this theme.
 *
 * In this example, we register five plugins:
 * - one included with the TGMPA library
 * - two from an external source, one from an arbitrary source, one from a GitHub repository
 * - two from the .org repo, where one demonstrates the use of the `is_callable` argument
 *
 * The variables passed to the `tgmpa()` function should be:
 * - an array of plugin arrays;
 * - optionally a configuration array.
 * If you are not changing anything in the configuration array, you can remove the array and remove the
 * variable from the function call: `tgmpa( $plugins );`.
 * In that case, the TGMPA default settings will be used.
 *
 * This function is hooked into `tgmpa_register`, which is fired on the WP `init` action on priority 10.
 */
function nextwp_headless_theme_register_required_plugins()
{
	/*
	 * Array of plugin arrays. Required keys are name and slug.
	 * If the source is NOT from the .org repo, then source is also required.
	 */
	$plugins = array(
		array(
			'name'      => 'NextWP - Headless Toolkit',
			'slug'      => 'nextwp-toolkit',
			'source'    => 'https://www.nextwp.org/api/download/nextwp-toolkit',
			'is_callable' => 'nextwp_acf_init',
			'required'     => true
		),

		array(
			'name'      => 'Advanced Custom Fields Pro',
			'slug'      => 'advanced-custom-fields-pro',
			'source'    => 'https://github.com/pronamic/advanced-custom-fields-pro/archive/main.zip',
			'required'     => false
		),
		array(
			'name'      => 'JAMstack Deployments',
			'slug'      => 'wp-jamstack-deployments',
			'required'     => false
		),
		array(
			'name'      => 'Next.js On-Demand Revalidation',
			'slug'      => 'on-demand-revalidation',
			'required'     => false
		),
		array(
			'name'      => 'Classic Editor',
			'slug'      => 'classic-editor',
			'required'     => false
		),
		array(
			'name'        => 'Gravity Forms',
			'slug'        => 'gravityforms',
			'is_callable' => 'gform_loaded',
			'source'    => 'https://github.com/pronamic/gravityforms/archive/main.zip',
			'required'     => false
		),
		array(
			'name'        => 'Yoast SEO',
			'slug'        => 'wordpress-seo',
			'is_callable' => 'wpseo_init', // using is_callable here allows us to use the Pro version or Free version
			'required'	  => false
		),
	);

	/*
	 * Array of configuration settings. Amend each line as needed.
	 *
	 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
	 * strings available, please help us make TGMPA even better by giving us access to these translations or by
	 * sending in a pull-request with .po file(s) with the translations.
	 *
	 * Only uncomment the strings in the config array if you want to customize the strings.
	 */
	$config = array(
		'id'           => 'nextwp-headless-theme',                 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',                      // Default absolute path to bundled plugins.
		'menu'         => 'tgmpa-install-plugins', // Menu slug.
		'parent_slug'  => 'themes.php',            // Parent menu slug.
		'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
		'has_notices'  => true,                    // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => false,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.
	);

	tgmpa($plugins, $config);
}
