<?php $meta = array(
    'site_url' => get_site_url(),
    'template' => get_current_template(),
    'request_uri' => $_SERVER['REQUEST_URI']
);
$meta_json = json_encode($meta); ?><script id="wp-meta" data-wordpress="<?php echo $meta_json; ?>" type="text/javascript">window['WP_Meta'] = <?php echo $meta_json; ?>;</script>