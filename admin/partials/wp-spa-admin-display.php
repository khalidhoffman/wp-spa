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
*/ ?><div class="heading"><div class="heading_content"><?php echo esc_html(get_admin_page_title());; ?></div></div><div class="settings"><div class="setting__content"><div class="setting-section setting-section--actions"><a href="#" class="button button-primary button--update">Update WP-SPA</a></div><div class="setting-section setting-section--vars"><?php settings_field($this->plugin_name);
do_settings_sections($this->plugin_name);
submit_buttton(); ?></div></div></div>