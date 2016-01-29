<?php
require_once('utils.php');


function wp_spa_show_json_sitemap() {
    if (isset($_GET['show_sitemap'])) {
        die(json_encode(get_json_sitemap()));
    }
}

add_action('template_redirect', 'wp_spa_show_json_sitemap');