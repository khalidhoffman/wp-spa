<?php
require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-spa-loggable.php';

class WP_SPA_Request_Handler extends WP_SPA_Loggable {
    protected $utils;

    function __construct() {
        parent::__construct();
        $this->utils = new Wp_Spa_Utils();
    }

    public function get_request_result(){

    }

    public function on_ajax_get() {
        if (isset($_GET['show_json_sitemap']) ||
            isset($_GET['wp_spa_sitemap']) ||
            isset($_GET['wp_spa_show_json_sitemap'])
        ) {
            die(json_encode($this->utils->get_json_sitemap()));
        } else if (isset($_GET['wp_spa_config'])){
            die(json_encode($this->utils->get_json_config()));
        }
    }

    public function on_ajax_post() {
        $endpoint = sanitize_text_field($_POST['endpoint']);
        $data = sanitize_text_field($_POST['data']);
        $method = sanitize_text_field($_POST['method']);
        $wp_spa_request = sanitize_text_field($_POST['wpspa']);

        $this->logger->addInfo("making request", array($endpoint, $data));

        if ($wp_spa_request){
            $response = 'no-op';
            switch ($wp_spa_request){
                case 'config':
                case 'meta':
                    $response = json_encode(get_option('wp_spa_json_config'));
                    break;
            }
            die($response);
        } else {
            $response = $this->get_request_result($endpoint, $data, $method);
            die('success');
        }

    }
}
