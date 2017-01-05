<?php /**
* Provide a admin area view for the plugin
*
* This file is used to markup the admin-facing aspects of the plugin.
*
* @link       khalidhoffman.solutions
* @since      1.0.0
*
* @package    Wp_Spa
* @subpackage Wp_Spa/admin/partials
*/ ?><div id="wp-spa"><div class="heading"><h1 class="heading__content"><?php echo esc_html(get_admin_page_title());; ?></h1></div><div class="settings"><div class="settings__content"><div class="setting-section setting-section--vars setting-section--left"><div class="setting-section__content"><form class="setting-form" action="options.php" method="post"><?php settings_fields($this->plugin_name);
do_settings_sections($this->plugin_name);
submit_button(); ?></form></div></div><div class="setting-section setting-section--demo setting-section--right"><div class="wpspa-demo"><div class="wpspa-demo__heading"><h2>Demo</h2></div><div class="wpspa-demo__content"><div class="wpspa-demo__view"><div class="wpspa-demo__demo_el"></div></div><select class="wpspa-demo__setting"></select></div></div></div></div></div><div class="feedback"><div class="feedback__heading"><h2>Send Feedback</h2></div><div class="feedback__content"><textarea class="feedback__input"></textarea><a class="button button-primary button--send">Send</a></div></div></div>