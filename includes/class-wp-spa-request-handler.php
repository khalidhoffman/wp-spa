<?php
require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-wp-spa-loggable.php';

Requests::register_autoloader();

class WP_SPA_Request_Handler extends WP_SPA_Loggable {
    protected $utils;

    function __construct() {
        parent::__construct();
        $this->utils = new Wp_Spa_Utils();
    }

    public function updateConfig($data) {
        $this->logger->addInfo('updating config w/', array($data));
    }

    public function sendEmail($data) {
        $this->logger->addInfo('sending email w/ message', array($data['message']));
        $email_request = Requests::post('http://bot.khalidhoffman.net', array(), $data);
        $this->logger->addInfo('email sent', array($email_request));
    }

    public function on_ajax_get() {
        if (isset($_GET['show_json_sitemap']) ||
            isset($_GET['wp_spa_sitemap']) ||
            isset($_GET['wp_spa_show_json_sitemap'])
        ) {
            die(json_encode($this->utils->get_json_sitemap()));
        } else if (isset($_GET['wp_spa_config'])) {
            die(json_encode($this->utils->get_json_config()));
        }
    }

    public function on_ajax_post() {

        $this->logger->addInfo('on_ajax_post()', $_POST );
        if (isset($_POST['wpspa'])) {
            $wp_spa_request = sanitize_text_field($_POST['wpspa']);

            $response = 'no-op';
            switch ($wp_spa_request) {
                case 'email':
                    $response = $this->sendEmail($_POST['data']);
                    break;
                case 'update':
                    $response = $this->updateConfig($_POST['data']);
                    break;
                case 'config':
                case 'meta':
                    $response = json_encode(get_option('wp_spa_json_config'));
                    break;
            }
            die($response);
        } else {

            die('no-op');
        }

    }
}
