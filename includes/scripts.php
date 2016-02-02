<?php

function wp_spa_scripts() {
    //  TODO Loading via WordPress yields a conflict somewhere with 'define' function

    wp_enqueue_script(
        'require',
        get_site_url( null, 'wp-content/plugins/wp-spa/js/vendors/require.js' ),
        array(),
        false,
        true
    );
    wp_enqueue_script(
        'require-wp-spa',
        get_site_url( null, 'wp-content/plugins/wp-spa/js/rjs-config.js' ),
        array( 'require' ),
        false,
        true
    );
    wp_enqueue_script(
        'wp-spa',
        get_site_url( null, 'wp-content/plugins/wp-spa/js/app-dev.js' ),
        array( 'require-wp-spa' ),
        false,
        true
    );
//    wp_enqueue_script(
//        'wp-spa',
//        get_site_url(null, 'wp-content/plugins/wp-spa/public/js/wp-spa.js'),
//        array(),
//        false,
//        true
//    );
}

add_action( 'wp_enqueue_scripts', 'wp_spa_scripts', 9999 );