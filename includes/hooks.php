<?php

require_once('utils.php');

function wp_spa_template_include($template_file) {
    $GLOBALS['current_theme_template'] = basename($template_file, '.php');
    return $template_file;
}

add_filter('template_include', 'wp_spa_template_include', 1000);

function wp_spa_add_footer_meta() {
    include("../public/ng-footer.php");
    return;
}

add_action('wp_footer', 'wp_spa_add_footer_meta');

function wp_spa_add_header_meta() {
    $meta = array();
    printf("
    <div id='wp-meta' data-wordpress='%s'></div>
    ", json_encode($meta));
    return;
}

//add_action('wp_header', 'add_site_header_meta');
