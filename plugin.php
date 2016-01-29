<?php
/**
 * Plugin Name: WP Single Page Application
 * Plugin URI: http://www.dppad.com
 * Description: Setup WordPress site to behave like a single page application
 * Author: Khalid Hoffman
 * Author URI: http://www.khalidhoffman.info
 * Version: 0.1
 */

function on_wp_spa_activation() {
    // Activation code here...

    $response = array(
        'rootPath' => get_site_url()
    );
    $location = plugin_dir_path(__FILE__) . 'config.json';
    $fp = fopen($location, 'w');
    fwrite($fp, json_encode($response));
    fclose($fp);

}

register_activation_hook(__FILE__, 'on_wp_spa_activation');

require_once('includes/api.php');
require_once('includes/hooks.php');
require_once('includes/scripts.php')

?>