<?php
require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wp-spa-loggable.php';

class WP_SPA_Message_Handler extends WP_SPA_Loggable {
    private $messages_queue_namespace = 'wp_spa_messages';
    private $message_queue = array();

    function __construct() {
        parent::__construct();
    }

    public function is_within_wpspa_scope() {
        return isset($_GET['page']) && $_GET['page'] == 'wp-spa';
    }

    public function clear_messages() {
        $this->save_messages([]);
    }

    public function queue_message($message, $type = 'info') {
        $message_queue = array();
        $message_queue_content = get_option($this->messages_queue_namespace);
        $this->logger->addInfo("queue_message - content", array($message_queue_content));
        if (null !== $message_queue) {
            $message_queue = json_decode($message_queue_content);
            if (!is_array($message_queue)) {
                $message_queue = array();
            }
        }
        array_push($message_queue, array(
            'text' => $message,
            'type' => $type
        ));
        $this->message_queue = $message_queue;
        $this->save_messages();
    }

    public function save_messages($messages = null) {
        if (is_array($messages)) {
            update_option($this->messages_queue_namespace, json_encode($messages));
            $this->message_queue = $messages;
        } else {
            update_option($this->messages_queue_namespace, json_encode($this->message_queue));
        }
//        $this->logger->addInfo('save_messages', $this->message_queue);
    }

    public function render_message($message_meta) {
        switch ($message_meta['type']) {
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

        return sprintf("<div class='notice %s is-dismissible'><p>%s</p></div>", $class_name, _($message_meta['text']));
    }


    public function get_messages() {
        $messages_queue = get_option($this->messages_queue_namespace);
        $this->message_queue = json_decode($messages_queue);

        return (array)$this->message_queue;
    }

    public function print_messages() {
        if ($this->is_within_wpspa_scope()) {
            $messages = $this->get_messages();
            $message_count = 0;
            $limit = 100;

            if (isset($_GET['action'])) {
                $this->on_actions_complete();
            } else {
                while (sizeof($messages) > 0 && $message_count < $limit) {
                    $message_meta = (array)array_pop($messages);
                    switch ($message_meta['type']) {
                        case 'info':
                        case 'warning':
                        case 'error':
                        case 'success':
                            echo $this->render_message($message_meta);
                            break;
                        default:
                            break;
                    }
                    $message_count++;
                }
            }

            $this->save_messages($messages);
        }
    }

    private function on_actions_complete() {
        $this->logger->addInfo('clearing messages');
        $current_url = $_SERVER["REQUEST_URI"];
        $current_url_meta = parse_url($current_url);

        $url_query_params = array();
        parse_str($current_url_meta['query'], $url_query_params);
        unset($url_query_params['action']);
        $updated_query_params_str = http_build_query($url_query_params);
        $updated_url = $current_url_meta['path'] . '?' . $updated_query_params_str;
        header("Location: " . $updated_url);
        $this->logger->addInfo('current_url_meta', $current_url_meta);
    }

}