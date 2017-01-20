<?php

class WP_Spa_Config {
    private $values = array();

    private $settings = array(
        array(
            'name' => 'asyncAnimation',
            'label' => "Animate transitions simultaneously",
            'description' => 'animate page entry at the same time as page exit',
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox_value',
            'default' => '1'
        ),
        array(
            'name' => 'captureAll',
            'label' => "Capture all WP links",
            'description' => 'Whether to handle navigation for all links or just posts and pages',
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox_value',
            'default' => '1'
        ),
        array(
            'name' => 'showLoadingScreen',
            'label' => "Show Loading Animation",
            'description' => 'Show loading animation between transitions',
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox_value',
            'default' => '1'
        ),
        array(
            'conditionals' => array('#wp_spa_showLoadingScreen'),
            'name' => 'loadingScreenType',
            'label' => "Loading Indicator Type",
            'description' => 'Whether to display a progress loading bar or pulsing icon',
            'type' => 'select',
            'options' => array('indeterminate', 'progress'),
            'default' => 'indeterminate'
        ),
        array(
            'conditionals' => array('#wp_spa_showLoadingScreen'),
            'name' => 'loadingColor',
            'label' => "Loading Indicator Color",
            'description' => 'Color of loading indicator between animations',
            'type' => 'color',
            'default' => '#4DD0E1'
        ),
        array(
            'name' => 'overrideBackgroundColor',
            'label' => "Override Background Color",
            'description' => 'Set background color for between animations',
            'type' => 'checkbox',
            'default' => '1'
        ),
        array(
            'conditionals' => array('#wp_spa_overrideBackgroundColor'),
            'name' => 'backgroundColor',
            'label' => "Background Color",
            'description' => 'Page background between animations',
            'type' => 'color',
            'default' => '#212121'
        ),
        array(
            'name' => 'animationInName',
            'label' => "Animation Name (In)",
            'description' => 'Page entry animation',
            'type' => 'animation',
            'default' => 'pageIn'
        ),
        array(
            'name' => 'animationOutName',
            'label' => "Animation Name (Out)",
            'description' => 'Page exit animation',
            'type' => 'animation',
            'default' => 'pageOut'
        ),
        array(
            'name' => 'animationInDuration',
            'label' => "Animation Duration (In)",
            'description' => 'In milliseconds. For page entry animation',
            'type' => 'number',
            'default' => 600
        ),
        array(
            'name' => 'animationOutDuration',
            'label' => "Animation Duration (Out)",
            'description' => 'In milliseconds. For page exit animation',
            'type' => 'number',
            'default' => 600
        ),
        array(
            'name' => 'siteURL',
            'type' => 'hidden',
            'callback' => 'sanitize_site_url'
        ),
        array(
            'name' => 'useScreenClip',
            'label' => 'Clip Views',
            'description' => 'fix the view during transitions (can improve performance)',
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox_value',
            'default' => '1'
        ),
        array(
            'name' => 'enforceSmooth',
            'label' => 'Enforce Smooth Animations ',
            'description' => 'helps guarantee smooth animations at the cost load time',
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox_value',
            'default' => '1'
        ),
        array(
            'name' => 'enableCacheBusting',
            'label' => 'Force Browser Updates',
            'description' => 'Enables cache-busting methods to ensure the browser always uses the latest settings on page load (Many browsers like to reuse previous settings for speed)',
            'type' => 'checkbox',
            'callback' => 'sanitize_checkbox_value',
            'default' => '1'
        )
    );
    private $saveDir = '/data/';
    private $filename = 'wp-spa.config.json';
    public static $option_namespace = 'wp_spa_json_config';

    public static function format_option_name($option_name) {
        return 'wp_spa_' . $option_name;
    }

    /**
     * WP_Spa_Config constructor.
     *
     * @param array $values
     * @param array $options
     */
    function __construct($values = null, $options = array()) {
        if (isset($options['saveDir'])) {
            $this->saveDir = $options['saveDir'];
        }
        if (isset($options['filename'])) {
            $this->filename = $options['filename'];
        }
        if (null == $values) {
            $values = array();
            foreach ($this->settings as $setting) {
                if (isset($setting['default'])) {
                    $values[$setting['name']] = $setting['default'];
                }
            }
        }
        $this->values = $values;
    }

    public function get_description($key) {
        $description = null;
        foreach ($this->settings as $setting) {
            if ($setting['name'] == $key && isset($setting['description'])) {
                $description = $setting['description'];
                break;
            }
        }
        return $description;
    }

    public function get_value($key_name) {
        return $this->values[$key_name];
    }

    public function set_value($key_name, $value) {
        $this->values[$key_name] = $value;
    }

    public function sanitize_checkbox_value($val) {
        return (isset($val) && strlen($val) > 0) ? "1" : "";
    }

    public function sanitize_site_url() {
        return get_site_url();
    }

    public function save_json_config() {
        $config_values = array();
        foreach ($this->settings as $setting) {
            $setting_key = $setting['name'];
            $value = $this->get_value($setting_key);
            if (isset($value)) {
                $config_values[$setting_key] = $value;
            } else if (isset($setting['default'])) {
                $config_values[$setting_key] = $setting['default'];
            }
        }
        $data_text = json_encode($config_values);
        update_option(WP_Spa_Config::$option_namespace, $data_text);
    }

    public function save_options() {
        foreach ($this->settings as $setting) {
            $value = $this->get_value($setting['name']);
            switch ($setting['type']) {
                case 'checkbox':
                    $value = $this->sanitize_checkbox_value($value);
                    error_log("setting " . $setting['name'] . "to $value");
                    break;
                default:
                    break;
            }
            update_option(WP_Spa_Config::format_option_name($setting['name']), $value);
        }
    }

    public function save() {
        $this->save_options();
        $this->save_json_config();
    }

    public function get_settings() {
        return $this->settings;
    }
}
