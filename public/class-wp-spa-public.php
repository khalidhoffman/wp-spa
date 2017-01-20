<?php
require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-wp-spa-request-handler.php';

/**
 * The public-facing functionality of the plugin.
 *
 * @link       khalidhoffman.solutions
 * @since      1.0.0
 *
 * @package    Wp_Spa
 * @subpackage Wp_Spa/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Wp_Spa
 * @subpackage Wp_Spa/public
 * @author     Khalid Hoffman <khalidhoffman@gmail.com>
 */
class Wp_Spa_Public extends WP_SPA_Request_Handler {

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $plugin_name The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $version The current version of this plugin.
     */
    private $version;


    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string $plugin_name The name of the plugin.
     * @param      string $version The version of this plugin.
     */
    public function __construct($plugin_name, $version) {
        parent::__construct();
        show_admin_bar(false);
        $this->plugin_name = $plugin_name;
        $this->version = $version;

    }

    public function set_current_theme_template($template_file) {
        $GLOBALS['current_theme_template'] = basename($template_file, '.php');
        return $template_file;
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_styles() {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Wp_Spa_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Wp_Spa_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/wp-spa-public.min.css', array(), $this->version, 'all');

    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts() {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Wp_Spa_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Wp_Spa_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        $is_cache_busting_enabled = intval(get_option(WP_Spa_Config::format_option_name('enableCacheBusting'))) === 1;
        wp_enqueue_script(
            $this->plugin_name,
            plugin_dir_url(__FILE__) . 'js/wp-spa-public.js',
            array('jquery'),
            $is_cache_busting_enabled ? round(microtime(true) * 1000) : $this->version,
            true
        );

    }

    public function on_wp_head() {
        $html_output = '<base href="' . get_site_url() . '/">';
        /*
        $meta_data = array(
            'wp-spa-base-url' => get_site_url()
        );
        foreach ($meta_data as $meta_name => $meta_content) {
            $html_output = "<meta name='$meta_name' content='$meta_content'>";
        };
        */
        echo $html_output;
    }


    public function on_shutdown() {
        $final = '';

        // We'll need to get the number of ob levels we're in, so that we can iterate over each, collecting
        // that buffer's output into the final output.
        $levels = ob_get_level();

        for ($i = 0; $i < $levels; $i++) {
            $final .= ob_get_clean();
        }

        // Apply any filters to the final output
        echo apply_filters('final_output', $final);
    }

    public function on_final_output($html) {
	$styles = "";
	$wp_spa_props = "";
	$wp_spa_page_class_name = "";
	$wp_spa_page_props = "";
	if ( $GLOBALS['pagenow'] !== 'wp-login.php' ) {
	    // We're on the login page!
            if(intval(get_option(WP_Spa_Config::format_option_name('overrideBackgroundColor'))) == 1){
                $styles = sprintf("<style>body{background-color: %s;}</style>", get_option(WP_Spa_Config::format_option_name('backgroundColor')));
            }
            if(intval(get_option(WP_Spa_Config::format_option_name('showLoadingScreen'))) == 1){
                $wp_spa_props = sprintf("data-wp-spa-loader-type='%s' data-wp-spa-loader-color='%s'",
                    get_option(WP_Spa_Config::format_option_name('loadingScreenType')),
                    get_option(WP_Spa_Config::format_option_name('loadingColor')));
            }
	    $wp_spa_page_class_name = "animate-page-in spa-content--no-js";
	    $wp_spa_page_props = sprintf("");
	}

        // add attrs and wrapper elements to opening body tag
        $html = preg_replace("/(<\s*html[^>]*)>/", "$1>", $html);

        // add attrs and wrapper elements to opening body tag
        $html = preg_replace("/<(\s*body[^>]*)>/", "$styles<$1><div class=\"spa-content\" $wp_spa_props><div class=\"spa-content__page $wp_spa_page_class_name\" $wp_spa_page_props><div class=\"spa-content__view\">", $html);

        // add closing tags to closing body tag
        $html = preg_replace("/(<\s*\/\s*body\s*\>)/", "</div></div></div>$1", $html);


        return $html;
    }

}
