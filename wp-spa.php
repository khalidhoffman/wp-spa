<?php
require_once ('vendor/autoload.php');
require('includes/class-wp-spa-utils.php');
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              khalidhoffman.solutions
 * @since             1.0.0
 * @package           Wp_Spa
 *
 * @wordpress-plugin
 * Plugin Name:       WP-SPA
 * Plugin URI:        http://dppad.com
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.4
 * Author:            Khalid Hoffman
 * Author URI:        khalidhoffman.solutions
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-spa
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define("WP_SPA_PLUGIN_OPTIONS_URL", site_url("/wp-admin/options-general.php?page=wp-spa"));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wp-spa-activator.php
 */
function activate_wp_spa() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-spa-activator.php';
	Wp_Spa_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wp-spa-deactivator.php
 */
function deactivate_wp_spa() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-spa-deactivator.php';
	Wp_Spa_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_wp_spa' );
register_deactivation_hook( __FILE__, 'deactivate_wp_spa' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wp-spa.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_wp_spa() {

	$plugin = new Wp_Spa();
	$plugin->run();

}
run_wp_spa();
