<?php
require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-wp-spa-utils.php';

class Wp_Spa_Utils {

    function __construct() {
        if (!function_exists('get_current_template')) {
            function get_current_template($echo) {
                return $this->get_current_template($echo);
            }
        }

        if (!function_exists('get_json_sitemap')) {
            function get_json_sitemap() {
                return $this->get_json_sitemap();
            }
        }
    }

    /**
     * @param bool|false $echo
     * @return bool
     */
    public function get_current_template($echo = false) {
        if (!isset($GLOBALS['current_theme_template'])) {
            return false;
        }
        if ($echo) {
            echo $GLOBALS['current_theme_template'];
        } else {
            return $GLOBALS['current_theme_template'];
        }
    }

    public function get_json_config() {
        return get_option(WP_Spa_Config::$option_namespace);
    }

    function get_json_sitemap() {
        //set up an array for all the URLs
        $urls = array();

        //get all the pages, posts (including CPTs)
        $post_query = new WP_Query(array(
            'post_type' => 'any',
            'posts_per_page' => '-1',
            'post_status' => 'publish'
        ));

        while ($post_query->have_posts()) {
            $post_query->the_post();
            global $post;
            $post_type = $post->post_type;
            if (!(isset($urls[$post_type]) && is_array($urls[$post_type]))) {
                $urls[$post_type] = array();
            }
            array_push($urls[$post_type], get_permalink());
        }
        return $urls;
    }
}
