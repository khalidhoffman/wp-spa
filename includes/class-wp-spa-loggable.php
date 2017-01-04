<?php

use Monolog\Handler\ChromePHPHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;

class WP_SPA_Loggable {
    private $messages_queue_namespace = "wp_spa_messages";

    function __construct() {
        $log = new Logger('wp_spa_admin_log');
//        $log->pushHandler( new StreamHandler( dirname( __DIR__ . '/../../' ) . "/data/dev.log", Logger::INFO ) );
//        $log->pushHandler(new ChromePHPHandler(Logger::INFO));
        $this->logger = $log;
    }


    private function clear_messages() {
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

    private function save_messages($messages = null) {
        if (is_array($messages)) {
            update_option($this->messages_queue_namespace, json_encode($messages));
            $this->message_queue = $messages;
        } else {
            update_option($this->messages_queue_namespace, json_encode($this->message_queue));
        }
        $this->logger->addInfo('save_messages', $this->message_queue);
    }

    private function render_message($message_meta) {
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
}
