<?php
require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-wp-spa-config.php';
require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-wp-spa-message-handler.php';
require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-wp-spa-utils.php';

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
class Wp_Spa_Admin extends WP_SPA_Message_Handler {

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

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $version The current version of this plugin.
     */
    private $version;

    private $utils;
    private $settings = array(
        array(
            'name' => 'asyncAnimation',
            'label' => "Animate transitions simultaneously",
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox'
        ),
        array(
            'name' => 'useCache',
            'label' => "Cache Pages",
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox'
        ),
        array(
            'name' => 'animationInName',
            'label' => "Animation Name (In)",
            'type' => 'select'
        ),
        array(
            'name' => 'animationOutName',
            'label' => "Animation Name (Out)",
            'type' => 'select'
        ),
        array(
            'name' => 'animationInDuration',
            'label' => "Animation Duration (In)",
            'type' => 'number'
        ),
        array(
            'name' => 'animationOutDuration',
            'label' => "Animation Duration (Out)",
            'type' => 'number'
        ),
        array(
            'name' => 'siteURL',
            'type' => 'hidden',
            'callback' => 'sanitize_site_url'
        )
    );

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     *
     * @param      string $plugin_name The name of this plugin.
     * @param      string $version The version of this plugin.
     */
    public function __construct($plugin_name, $version) {
        parent::__construct();
        show_admin_bar(false);
        $this->utils = new Wp_Spa_Utils();

        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->perform_actions();
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

        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/wp-spa-admin.min.css', array(), $this->version, 'all');

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

        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/wp-spa-admin.js', array('jquery'), $this->version, true);

    }

    /**
     * Render the options page for plugin
     *
     * @since  1.0.0
     */
    public function display_options_page() {
        include_once 'partials/wp-spa-admin-display.php';
    }


    private function generate_option_namespace_suffix($option_name) {
        return '_' . $option_name;
    }

    /**
     * Render the text for the general section
     *
     * @since  1.0.0
     */
    public function options_heading() {
        include_once 'partials/wp-spa-admin-display-heading.php';
    }

    /**
     * Add an options page under the Settings submenu
     *
     * @since  1.0.0
     */
    public function add_options_page() {

        $this->plugin_screen_hook_suffix = add_options_page(
            __('WP-SPA Settings', $this->plugin_text_namespace),
            __('WP-SPA Settings', $this->plugin_text_namespace),
            'manage_options',
            $this->plugin_name,
            array($this, 'display_options_page')
        );

    }

    private function get_option($option_name) {
        return get_option('wp_spa_' . $option_name);
    }

    private function add_setting($option_name, $label = "New Option", $type = 'text', $callback = false) {

        $input_type = strtolower($type);
        $option_namespace_suffix = $this->generate_option_namespace_suffix($option_name);
        $option_lookup_name = $this->option_namespace . $option_namespace_suffix;
        if ($callback) {
            register_setting(
                $this->plugin_name,
                $this->option_namespace . $option_namespace_suffix,
                array($this, $callback)
            );
        } else {
            register_setting(
                $this->plugin_name,
                $this->option_namespace . $option_namespace_suffix
            );
        }

        switch ($input_type) {
            case 'text':
            case 'select':
            case 'number':
            case 'hidden':
            case 'checkbox':
                add_settings_field(
                    $option_lookup_name,
                    __($label, $this->plugin_text_namespace),
                    array($this, $this->option_namespace . '_render_input'),
                    $this->plugin_name,
                    $this->option_namespace . $this->generate_option_namespace_suffix($this->main_settings_option_name),
                    array('name' => $option_lookup_name, 'label' => $label, 'type' => $type)
                );
                break;
            default:
                error_log('wp-spa.admin received an invalid input type:' . $type);
                break;
        }
    }

    public function register_settings() {
        add_settings_section(
            $this->option_namespace . $this->generate_option_namespace_suffix($this->main_settings_option_name),
            __('General', $this->plugin_text_namespace),
            array($this, 'options_heading'),
            $this->plugin_name
        );

        foreach ($this->settings as $setting) {
            $name = isset($setting['name']) ? $setting['name'] : null;
            $label = isset($setting['label']) ? $setting['label'] : null;
            $type = isset($setting['type']) ? $setting['type'] : null;
            $callback = isset($setting['callback']) ? $setting['callback'] : null;
            $this->add_setting($name, $label, $type, $callback);
        }
    }

    public function wp_spa_render_input($args) {
        $option_name = $args['name'];
        $option_type = $args['type'];
        $option_value = get_option($option_name);
        switch ($option_type) {
            case 'select':
                echo "<select data-default='$option_value' name='$option_name' id='$option_name' disabled><option>Select an animation...</option></select>";
                break;
            case 'number':
                echo '<input type="number" name="' . $option_name . '" id="' . $option_name . '" value="' . $option_value . '"/> ';
                break;
            case 'checkbox':
                echo '<input type="checkbox" name="' . $option_name
                    . '" id="' . $option_name
                    . '" value="' . $option_value
                    . '" ' . ($option_value ? 'checked' : '')
                    . '/> ';
                break;
            case 'hidden';
                break;
            case 'text':
            default:
                echo '<input type="text" name="' . $option_name . '" id="' . $option_name . '" value="' . $option_value . '"/> ';
                break;
        }

    }

    public function sanitize_checkbox($val) {
        $this->logger->addInfo('sanitizing checkbox', array(func_get_args(), (isset($val))));

        return (isset($val)) ? 1 : 0;
    }

    public function sanitize_site_url() {
        return get_site_url();
    }

    public function on_option_updated() {
        $this->update_data_json();
    }


    private function perform_actions() {
        if (isset($_GET['page']) && $_GET['page'] == 'wp-spa') {
            if (isset($_GET['action'])) {
                $action = $_GET['action'];
                switch ($action) {
                    case 'clear':
                        $this->clear_messages();
                        break;
                    case 'update':
                        $this->update_data_json();
                        $this->queue_message('WP-SPA updated');
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private function update_data_json() {
        $config_data = array();
        foreach ($this->settings as $setting) {
            $config_data[$setting['name']] = $this->get_option($setting['name']);
        };
        $config = new WP_Spa_Config($config_data);
        $config->save();
    }

}
