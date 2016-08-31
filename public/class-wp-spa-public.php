<?php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

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
class Wp_Spa_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {


        $log = new Logger('wp_spa_log');
        $log->pushHandler(new StreamHandler(dirname(__DIR__ . '/../../') . "/data/dev.log", Logger::INFO));
        $this->logger = $log;
		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	public function wp_spa_footer_meta() {
		include(plugin_dir_path( __FILE__ )."/partials/ng-footer.php");
		return;
	}

	public function wp_spa_head_meta() {
		include(plugin_dir_path( __FILE__ )."/partials/ng-header.php");
		return;
	}

	public function wp_spa_show_json_sitemap() {
		if (isset($_GET['show_sitemap'])) {
			die(json_encode(get_json_sitemap()));
		}
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/wp-spa-public.css', array(), $this->version, 'all' );

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

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/wp-spa-public.js', array(), $this->version, false );

	}

	public function handle_request() {
		error_log( "making request to {$_POST['endpoint']} with {$_POST['data']}" );
		$response = $this->get_request_result( $_POST['endpoint'], $_POST['data'], $_POST['method'] );
		die( 'success' );
	}


	public function on_shutdown(){
        $final = '';

        // We'll need to get the number of ob levels we're in, so that we can iterate over each, collecting
        // that buffer's output into the final output.
        $levels = ob_get_level();

        for ($i = 0; $i < $levels; $i++)
        {
            $final .= ob_get_clean();
        }

        // Apply any filters to the final output
        echo apply_filters('final_output', $final);
    }

    public function on_final_output($html){
        $html = preg_replace('/(<\s*body[^>]*)>/', '$1 ng-controller=\'mainController\'><div class=\'spa-content\'><div class=\'spa-content__content\'>', $html);
        $html = preg_replace('/(<\s*\/\s*body\s*\>)/', '</div></div>$1', $html);
        return $html;
    }

}
