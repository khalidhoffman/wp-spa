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
        'require-wp-spa-admin',
        get_site_url( null, 'wp-content/plugins/wp-spa/js/rjs-config.js' ),
        array( 'require' ),
        false,
        true
    );
    wp_enqueue_script(
        'wp-spa-admin',
        get_site_url( null, 'wp-content/plugins/wp-spa/js/app-dev.js' ),
        array( 'require-wp-spa-admin' ),
        false,
        true
    );
//    wp_enqueue_script(
//        'wp-spa-admin',
//        get_site_url(null, 'wp-content/plugins/wp-spa/admin/js/wp-spa.js'),
//        array(),
//        false,
//        true
//    );
}

error_log( 'url: ' . get_site_url( null, 'wp-content/plugins/wp-spa/public/js/wp-spa.js' ) );
add_action( 'wp_enqueue_scripts', 'wp_spa_scripts', 9999 );