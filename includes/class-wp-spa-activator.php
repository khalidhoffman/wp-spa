<?php

/**
 * Fired during plugin activation
 *
 * @link       khalidhoffman.solutions
 * @since      1.0.0
 *
 * @package    Wp_Spa
 * @subpackage Wp_Spa/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Wp_Spa
 * @subpackage Wp_Spa/includes
 * @author     Khalid Hoffman <khalidhoffman@gmail.com>
 */
class Wp_Spa_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {

		generate_json_config();

	}

}
