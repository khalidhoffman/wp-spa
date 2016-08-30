<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       khalidhoffman.solutions
 * @since      1.0.0
 *
 * @package    Wp_Spa
 * @subpackage Wp_Spa/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Wp_Spa
 * @subpackage Wp_Spa/admin
 * @author     Khalid Hoffman <khalidhoffman@gmail.com>
 */
class Wp_Spa_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	private $option_namespace = 'wp_spa';
	private $plugin_text_namespace = 'wp_spa';
	private $main_settings_option_name = 'general';

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/wp-spa-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/wp-spa-admin.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * Add an options page under the Settings submenu
	 *
	 * @since  1.0.0
	 */
	public function add_options_page() {

		$this->plugin_screen_hook_suffix = add_options_page(
			__( 'WP-SPA Settings', $this->plugin_text_namespace ),
			__( 'WP-SPA API',  $this->plugin_text_namespace),
			'manage_options',
			$this->plugin_name,
			array( $this, 'display_options_page' )
		);

	}

	/**
	 * Render the options page for plugin
	 *
	 * @since  1.0.0
	 */
	public function display_options_page() {
		include_once 'partials/wp-spa-admin-display.php';
	}


	private function generate_option_namespace_suffix($option_name){
		return '_' . $option_name;
	}


	private function add_setting($option_name, $label = "New Option"){

		$option_namespace_suffix = $this->generate_option_namespace_suffix($option_name);
		register_setting( $this->plugin_name, $this->option_namespace . $option_namespace_suffix, array(
			$this,
			$this->option_namespace . '_sanitize' . $option_namespace_suffix
		) );

		add_settings_field(
			$this->option_namespace . $option_namespace_suffix,
			__( $label, $this->plugin_text_namespace ),
			array( $this, $this->option_namespace . $option_namespace_suffix . '_cb' ),
			$this->plugin_name,
			$this->option_namespace . $this->generate_option_namespace_suffix($this->main_settings_option_name),
			array( 'label_for' => $this->option_namespace . $option_namespace_suffix )
		);
	}

	public function register_settings() {
		add_settings_section(
			$this->option_namespace . $this->generate_option_namespace_suffix($this->main_settings_option_name),
			__( 'General', $this->plugin_text_namespace ),
			array( $this, 'options_heading' ),
			$this->plugin_name
		);

		$this->add_setting('test', "Test");

		register_setting( $this->plugin_name, $this->option_namespace . '_tokenExpiration');
		register_setting( $this->plugin_name, $this->option_namespace . '_token' );
	}

	/**
	 * Render the text for the general section
	 *
	 * @since  1.0.0
	 */
	public function options_heading() {
		echo '<p>' . __( 'WP-SPA.', $this->plugin_text_namespace ) . '</p>';
	}


	/**
	 * Render the input field for API Key
	 *
	 * @since  1.0.0
	 */
	public function wp_spa_test_cb() {
		$option_suffix = $this->generate_option_namespace_suffix('test');
		$retailerId  = get_option( $this->option_namespace . $option_suffix );
		echo '<input type="text" name="' . $this->option_namespace . $option_suffix . '" id="' . $this->option_namespace . $option_suffix . '" value="' . $retailerId . '"> ';
	}

	function wp_spa_show_json_sitemap() {
		if (isset($_GET['show_sitemap'])) {
			die(json_encode(get_json_sitemap()));
		}
	}

}
