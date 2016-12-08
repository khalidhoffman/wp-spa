<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       khalidhoffman.solutions
 * @since      1.0.0
 *
 * @package    Wp_Spa
 * @subpackage Wp_Spa/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Wp_Spa
 * @subpackage Wp_Spa/includes
 * @author     Khalid Hoffman <khalidhoffman@gmail.com>
 */
class Wp_Spa {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Wp_Spa_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->plugin_name = 'wp-spa';
		$this->version = '1.0.0';

		if(!function_exists('get_current_template')) {

			/**
			 * @param bool|false $echo
			 * @return bool
			 */
			function get_current_template($echo = false) {
				if (!isset($GLOBALS['current_theme_template'])) {
					return false;
				}
				if ($echo) {
					echo $GLOBALS['current_theme_template'];
				} else {
					return $GLOBALS['current_theme_template'];
				}
			}
		}

		if(!function_exists('get_json_sitemap')){

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

		$this->load_dependencies();
		$this->set_locale();
        ob_start();

		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Wp_Spa_Loader. Orchestrates the hooks of the plugin.
	 * - Wp_Spa_i18n. Defines internationalization functionality.
	 * - Wp_Spa_Admin. Defines all hooks for the admin area.
	 * - Wp_Spa_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-spa-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-spa-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wp-spa-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-wp-spa-public.php';

		$this->loader = new Wp_Spa_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Wp_Spa_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Wp_Spa_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Wp_Spa_Admin( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'register_settings' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_options_page' );
		$this->loader->add_action( 'admin_notices', $plugin_admin, 'print_messages' );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Wp_Spa_Public( $this->get_plugin_name(), $this->get_version() );

		if(!is_admin()){
			$this->loader->add_filter( 'final_output', $plugin_public,'on_final_output', 0);
			$this->loader->add_filter( 'template_include', $plugin_public, 'set_current_theme_template', 1000 );
			$this->loader->add_action( 'shutdown', $plugin_public,'on_shutdown', 0);
			$this->loader->add_action( 'wp_footer', $plugin_public, 'wp_spa_footer_meta' );
			$this->loader->add_action( 'wp_head', $plugin_public, 'wp_spa_head_meta' );
		}

		$this->loader->add_action( 'wp_head', $plugin_public, 'on_wp_head' );
		$this->loader->add_action( 'wp_ajax_nopriv_wp_spa', $plugin_public, 'handle_request' );
		$this->loader->add_action( 'wp_ajax_wp_spa', $plugin_public, 'handle_request' );
		$this->loader->add_action( 'template_redirect', $plugin_public, 'wp_spa_show_json_sitemap' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts', 9999 );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Wp_Spa_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
