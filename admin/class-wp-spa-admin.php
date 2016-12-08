<?php
require_once dirname( __FILE__ ) . '/../includes/class-wp-spa-config.php';
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\ChromePHPHandler;

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
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	private $option_namespace = 'wp_spa';
	private $plugin_text_namespace = 'wp_spa';
	private $main_settings_option_name = 'general';
	private $messages_queue_namespace = 'wp_spa_messages';
	private $message_queue = array();

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
	 *
	 * @param      string $plugin_name The name of this plugin.
	 * @param      string $version The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$log = new Logger( 'wp_spa_admin_log' );
//		$log->pushHandler( new StreamHandler( dirname( __DIR__ . '/../../' ) . "/data/dev.log", Logger::INFO ) );
		$log->pushHandler( new ChromePHPHandler( Logger::INFO ) );
		$this->logger = $log;

		$this->plugin_name = $plugin_name;
		$this->version     = $version;
		$this->perform_actions();
	}

	private function perform_actions() {
		if ( isset( $_GET['page'] ) && $_GET['page'] == 'wp-spa' ) {
			if ( isset( $_GET['action'] ) ) {
				$action = $_GET['action'];
				switch ( $action ) {
					case 'update':
						$this->updateCachedSettings();
						break;
					default:
						break;
				}
			}
		}
	}

	private function onActionsComplete() {
		$this->logger->addInfo( 'clearing messages' );
		$current_url      = $_SERVER["REQUEST_URI"];
		$current_url_meta = parse_url( $current_url );

		$url_query_params = array();
		parse_str( $current_url_meta['query'], $url_query_params );
		unset( $url_query_params['action'] );
		$updated_query_params_str = http_build_query( $url_query_params );
		$updated_url              = $current_url_meta['path'] . '?' . $updated_query_params_str;
		header( "Location: " . $updated_url );
		$this->logger->addInfo( 'current_url_meta', $current_url_meta );
	}

	private function get_option( $option_name ) {
		return get_option( 'wp_spa_' . $option_name );
	}

	private function updateCachedSettings() {
		$config = new WP_Spa_Config( array(
			'mainSelector' => $this->get_option( 'mainSelector' ),
			'siteURL'      => get_site_url(),
			'useCache'     => $this->get_option( 'useCache' ) == 1
		) );
		$config->save();
		$this->queue_message( 'Updated JSON config' );
		error_log( 'queue message' );
	}

	private function queue_message( $message, $type = 'info' ) {
		$message_queue         = array();
		$message_queue_content = get_option( $this->messages_queue_namespace );
		$this->logger->addInfo( "queue_message - content", array( $message_queue_content ) );
		if ( null !== $message_queue ) {
			$message_queue = json_decode( $message_queue_content );
			if ( ! is_array( $message_queue ) ) {
				$message_queue = array();
			}
		}
		array_push( $message_queue, array(
			'text' => $message,
			'type' => $type
		) );
		$this->message_queue = $message_queue;
		$this->save_messages();
	}

	private function save_messages( $messages = null ) {
		if ( is_array( $messages ) ) {
			update_option( $this->messages_queue_namespace, json_encode( $messages ) );
			$this->message_queue = $messages;
		} else {
			update_option( $this->messages_queue_namespace, json_encode( $this->message_queue ) );
		}
		$this->logger->addInfo( 'save_messages', $this->message_queue );
	}

	private function render_message( $message_meta ) {
		switch ( $message_meta['type'] ) {
			case 'info':
			case 'error':
			case 'warning':
			case 'success':
				$class_name = 'notice-' . $message_meta['type'];
				break;
			default:
				$class_name = 'notice-info';
				break;
		}

		return sprintf( "<div class='notice %s is-dismissible'><p>%s</p></div>", $class_name, _( $message_meta['text'] ) );
	}

	public function get_messages() {
		$messages_queue      = get_option( $this->messages_queue_namespace );
		$this->message_queue = json_decode( $messages_queue );

		return (array) $this->message_queue;
	}


	private function is_within_wpspa_scope(){
		return isset($_GET['page']) && $_GET['page'] == 'wp-spa';
	}

	public function print_messages() {
		if ($this->is_within_wpspa_scope()){
			$messages      = $this->get_messages();
			$message_count = 0;
			$limit         = 100;

			if ( isset( $_GET['action'] ) ) {
				$this->onActionsComplete();
			} else {
				while ( sizeof( $messages ) > 0 && $message_count < $limit ) {
					$message_meta = (array) array_pop( $messages );
					switch ( $message_meta['type'] ) {
						case 'info':
						case 'warning':
						case 'error':
						case 'success':
							echo $this->render_message( $message_meta );
							break;
						default:
							break;
					}
					$message_count ++;
				}
			}

			$this->save_messages( $messages );
		}
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
			__( 'WP-SPA Settings', $this->plugin_text_namespace ),
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


	private function generate_option_namespace_suffix( $option_name ) {
		return '_' . $option_name;
	}


	private function add_setting( $option_name, $label = "New Option", $type = 'text', $callback = false ) {

		$input_type              = strtolower( $type );
		$option_namespace_suffix = $this->generate_option_namespace_suffix( $option_name );
		$option_lookup_name      = $this->option_namespace . $option_namespace_suffix;
		if ( $callback ) {
			register_setting(
				$this->plugin_name,
				$this->option_namespace . $option_namespace_suffix,
				array( $this, $callback )
			);
		} else {
			register_setting(
				$this->plugin_name,
				$this->option_namespace . $option_namespace_suffix
			);
		}

		switch ( $input_type ) {
			case 'text':
			case 'checkbox':
				add_settings_field(
					$option_lookup_name,
					__( $label, $this->plugin_text_namespace ),
					array( $this, $this->option_namespace . '_' . strtolower( $type ) . '_cb' ),
					$this->plugin_name,
					$this->option_namespace . $this->generate_option_namespace_suffix( $this->main_settings_option_name ),
					array( 'name' => $option_lookup_name, 'label' => $label )
				);
				break;
			default:
				error_log( 'wp-spa.admin received an invalid input type:' . $type );
				break;
		}
	}

	public function register_settings() {
		add_settings_section(
			$this->option_namespace . $this->generate_option_namespace_suffix( $this->main_settings_option_name ),
			__( 'General', $this->plugin_text_namespace ),
			array( $this, 'options_heading' ),
			$this->plugin_name
		);

		$this->add_setting( 'mainSelector', "Main Content Selector" );
		$this->add_setting( 'useCache', "Cache Pages", 'checkbox', 'sanitize_checkbox' );
	}

	/**
	 * Render the text for the general section
	 *
	 * @since  1.0.0
	 */
	public function options_heading() {
		include_once 'partials/wp-spa-admin-display-heading.php';
	}

	public function sanitize_checkbox( $val ) {
		$this->logger->addInfo( 'sanitizing checkbox', array( func_get_args(), ( isset( $val ) ) ) );

		return ( isset( $val ) ) ? 1 : 0;
	}

	/**
	 * Render the input field for API Key
	 *
	 * @since  1.0.0
	 */
	public function wp_spa_checkbox_cb( $args ) {
		$option_name  = $args['name'];
		$option_value = get_option( $option_name );
		echo '<input type="checkbox" name="' . $option_name
		     . '" id="' . $option_name
		     . '" value="' . $option_value
		     . '" ' . ( $option_value ? 'checked' : '' )
		     . '/> ';
	}

	public function wp_spa_text_cb( $args ) {
		$option_name  = $args['name'];
		$option_value = get_option( $option_name );
		echo '<input type="text" name="' . $option_name . '" id="' . $option_name . '" value="' . $option_value . '"/> ';
	}

	public function wp_spa_show_json_sitemap() {
		if ( isset( $_GET['show_json_sitemap'] ) ) {
			die( json_encode( get_json_sitemap() ) );
		}
	}

}
