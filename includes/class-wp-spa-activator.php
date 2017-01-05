<?php

require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-spa-config.php';

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


        if (null == get_option(WP_Spa_Config::$option_namespace)) {
            // do nothing
        } else {
            // save defaults as initial settings
            $default_config = new WP_Spa_Config();
            $default_config->save();
        }

        // TODO remove plugin settings temporary override
        $default_config = new WP_Spa_Config();
        $default_config->save();
    }

}
