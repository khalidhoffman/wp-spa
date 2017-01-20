=== WP-SPA ===
Contributors: khalidhoffman
Donate link: khalidhoffman.info
Tags: WordPress, SPA, plugin, animation, page, transition, effects
Requires at least: 4.5.0
Tested up to: 4.7.1
Stable tag: 4.5
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Enables animations between page transitions.

== Description ==

This Plugin enables a WordPress site to render animations between page transitions.

##### What's new?

- Adds Admin options for:
    - loading indicator type (progressive or indeterminate),
    - loading indicator color
    - background color
    - cache busting
    - (more experimental options for performance)
- pre-caching for better performance
- Fallback animations for no-js
- Animated feedback on same page clicks

##### Some notes about wp-spa

Page crawlers and SEO analytics should remain unaffected.
WP-SPA makes use of the latest technologies and fall backs on safe defaults when necessary.

Missing a feature? [Let me know!](http://khalidhoffman.net/#/get-in-touch)


== Installation ==
1. Download zip and install via WordPress

or

1. clone repo into `/wp-content/plugins/` directory

== Frequently Asked Questions ==

= Will this work with any WordPress site? =

Yes, hopefully.

= How do I use this? =

1. Activate Plugin
2. Navigate to WP-SPA settings
3. Change animation settings to your fancy

= What frameworks does this use? =

None! and jQuery is the only dependency (as of 1.3)

== Screenshots ==

1. assets/demo.gif

== Changelog ==

= 1.3.0 =
- Adds Admin options for:
    - loading indicator type (progressive or indeterminate),
    - loading indicator color
    - background color
    - cache busting
    - (more experimental options for performance)
- pre-caching for better performance
- Fallback animations for no-js
- Animated feedback on same page clicks

= 1.0.2 =
* Adds descriptions to admin settings

= 1.0.0 =
* First release

== Upgrade Notice ==

= 1.0.0 =
Initial Release

== Inspiration ==

Every site should be a SPA! It's 2016, after all.
