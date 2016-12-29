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
*/ ?><div id="wp-spa"><div class="heading"><h1 class="heading_content"><?php echo esc_html(get_admin_page_title());; ?></h1></div><div class="settings"><div class="setting__content"><div class="setting-section setting-section--actions"><a href="?page=wp-spa&amp;action=clear" class="button button-primary button--clear">Clear WP-SPA messages</a></div><div class="setting-section setting-section--vars"><div class="setting-section__content"><form action="options.php" method="post" class="setting-form"><?php settings_fields($this->plugin_name);
do_settings_sections($this->plugin_name);
submit_button(); ?></form></div></div></div></div></div>