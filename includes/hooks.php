<?php

require_once('utils.php');

function wp_spa_template_include($template_file) {
    $GLOBALS['current_theme_template'] = basename($template_file, '.php');
    return $template_file;
}

add_filter('template_include', 'wp_spa_template_include', 1000);

function wp_spa_footer_meta() {
    include(plugin_dir_path( __FILE__ )."/../public/ng-footer.php");
    return;
}

//add_action('wp_footer', 'wp_spa_footer_meta');

function wp_spa_head_meta() {
    include(plugin_dir_path( __FILE__ )."/../public/ng-header.php");
    return;
}

add_action('wp_head', 'wp_spa_head_meta');
