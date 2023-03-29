<?php
/** 
 * New Amerykah?
 * 
 * @package New amerykah 
 * @author Your Name
 * @copyright 2020 Your Name 
 * @license GPL-2.0-or-later 
 * 
 * @wordpress-plugin 
 * Plugin Name: New Amerykah
 * Plugin URI: https://mysite.com/hello-world 
 * Description: Cao
 * Version: 0.0.1 
 * Author: Your Name 
 * Author URI: https://mysite.com 
 * Text Domain: newamerykah
 * License: GPL v2 or later 
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * GitHub Plugin URI: 10000thmonkey/newamerykah
 * GitHub Plugin URI: https://github.com/10000thmonkey/newamerykah
 * 
 * */

$templ_dir = plugin_dir_path( __FILE__ );


global $nv_controllers;
$nv_controllers = array();

function nv_new_c ( $path, $callable )
{
	global $nv_controllers;
	$nv_controllers[ $path ] = $callable;
}

function nv_c ( $path, $VAR = array(), $print = false )
{
	global $nv_controllers;
	global $templ_dir;

	if ( file_exists( "$templ_dir$path.php" ) )
	{
		include_once "$templ_dir$path.php";
		return $nv_controllers[ $path ]( $VAR );
	}
	else {
		trigger_error( "Component $path does not exist!", E_USER_WARNING);
		return false;
	}
}

function nv_c_attr ( $attr )
{
	return esc_attr( json_encode( $attr ) );
}


global $nv_emails;
$nv_emails = array();

function nv_new_e ( $path, $callable )
{
	global $nv_emails;
	$nv_emails[ $path ] = $callable;
}

function nv_e ( $path, $VAR = array(), $print = false )
{
	global $nv_emails;
	global $templ_dir;

	if ( file_exists( "$templ_dir$path.php" ) )
	{
		include_once "$templ_dir$path.php";
		return $nv_emails[ $path ]( $VAR );
	}
	else {
		trigger_error( "Email does not exist!", E_USER_WARNING);
		return false;
	}
}




global $nv_templates;

function nv_new_t ( $path, $callable )
{
	global $nv_templates;
	$nv_templates[ $path ] = $callable; 
}
function nv_t ( $path )
{
	global $templ_dir;
	global $nv_templates;

	if ( file_exists( "$templ_dir$path.html" ) )
	{
		return file_get_contents( "$templ_dir$path.html" );
		//return $nv_templates[ $path ]();
	}
	else {
		trigger_error( "Template does not exist!", E_USER_WARNING);
		return false;
	}
}



function nv_ajax ( $endpoint, $callback )
{
	global $NV_DEV;
	$endpoint = str_replace( "/", "_", $endpoint );

	$passing = function () use ( $callback ) {
		//echo var_dump( $callback );
		if( $NV_DEV ) @ini_set( 'display_errors', 1 );
		echo json_encode( call_user_func( $callback ) );
		die();
	};
	add_action( "wp_ajax_nv_$endpoint", $passing );
	add_action( "wp_ajax_nopriv_nv_$endpoint", $passing );
}










function na_get_posts($offset = 0, $tag = '', $sort_by = 'date', $post_type = 'post', $options = [])
{
	$args = array(
		'post_type' => $post_type,
		'posts_per_page' => 12,
		'offset' => $offset,
		'orderby' => $sort_by,
		'order' => 'DESC',
		'tag' => $tag
	);
	$query = new WP_Query($args);
	
	if ($query->have_posts())
	{
		while ($query->have_posts())
		{
			$query->the_post();

			$title = '<h3>' . get_the_title() . '</h3>';

			if ("mapster-wp-location" === $post_type)
			{
				$meta = get_post_meta($query->post->ID);

				$link = $meta["popup_button_url"][0];
				$imgurl = $meta["popup_featured_image"];
				$img = ! empty( $imgurl ) ? nv_c("c/img", [ "attachment_id" => $imgurl[0], "sizes" => "(min-width: 1px) 300px, 300px" ] ) : '';
				$excerpt = ( strlen( $meta["popup_body_text"][0] ) > 150 ) ? ( substr($meta["popup_body_text"][0], 0, 150) . "..." ) : $meta["popup_body_text"];
				$date = '';
				$tags = '';
			}
			else
			{
				$link = get_the_permalink();
				$excerpt = get_the_excerpt();
				$imgurl = get_post_thumbnail_id();
				$img = $imgurl ? nv_c("c/img", [ "attachment_id" => $imgurl] ) : '';
				$date = '<div class="date">'. get_the_date() .'</div>';
				if ($options["show_tags"]) $tags = '<div class="tags">'. get_the_tags() .'</div>'; else $tags = '';
			}

			echo <<<HTML
				<a class="card" href="$link" target="_blank">
					<div class="img">
						$img
					</div>
					<div class="padding-hg rows gap-sm">
						$date
						$title
						$tags
					</div>
				</a>
			HTML;
		}
		wp_reset_postdata();
	} else {
		echo "No posts found.";
	}
}

function na_load_posts() {
	$offset = $_POST["offset"];
	$sort_by = $_POST["sort_by"];
	$tag = $_POST["tag"];
	$post_type = $_POST["post_type"];
	na_get_posts($offset, $tag, $sort_by, $post_type);
	wp_die();
}
add_action( "wp_ajax_na_load_posts", "na_load_posts" );
add_action( "wp_ajax_nopriv_na_load_posts", "na_load_posts" );




add_filter(
	'upload_mimes',
	function ($mimes) {
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
	}
);




 
add_action( "after_setup_theme",
	function() {
		add_theme_support( 'title-tag' );
		add_theme_support('post-thumbnails', array( 'post', 'page', 'custom-post-type-name' ));

		if ( ! is_admin() )
		{
			add_action(
				'wp_enqueue_scripts',
				function()
				{
					wp_enqueue_style( "nv-framework", "https://navalachy.cz/wp-content/themes/navalachy/assets/framework.css" );
					wp_enqueue_style( "newamerykah-css", "/wp-content/plugins/newamerykah/style.css" );

					// DISABLE WP DEFAULT RESOURCES WHEN NOT ON SINGLE POST
					if ( ! is_single() )
					{
						wp_dequeue_style('wp-block-library');
						wp_dequeue_style('wp-block-library-theme');
						wp_dequeue_style('wp-blocks-style');
						wp_dequeue_style('global-styles');
						wp_dequeue_style('global-styles-inline');

						wp_dequeue_style('classic-theme-styles');
					}
					
					defer_style( "weglot-css" );
					defer_style( "new-flag-css" );
					defer_style( "montserrat" );
			
				}, 999
			);
		

			add_filter( "show_admin_bar", "__return_false" );


			add_action( "wp_head", function() {
				echo nv_t("t/header");  
			} );


			add_action( "wp_footer", function() {
				echo nv_t("t/footer");  
			} );
		}
	}, 999
);



 

function defer_style( $handle )
{
	global $wp_styles;

    if ( isset( $wp_styles->registered[$handle] ) )
    {
        $plugin_style_src = $wp_styles->registered[$handle]->src;
        //print_r($plugin_style_src);

        wp_dequeue_style( $handle );
        
        echo '<link id="'.$handle.'" onload="this.onload=null;this.rel=\'stylesheet\'" href="'.$plugin_style_src.'" rel="preload" as="style">';
        //wp_enqueue_style( $handle, $plugin_style_src, array(), '1.0', 'all' );
    }
}



function defer_script( $handle )
{
	global $wp_scripts;

	if ( isset( $wp_scripts->registered[$handle] ) )
	{
		$script_src = $wp_scripts->registered[$handle]->src;
		wp_dequeue_script( $handle );

		add_action("wp_footer", function() use ( $handle, $script_src ) {
			echo '<script src="'.$script_src.'" id="'.$handle.'-js" defer></script>';
		});
	}
}





function load_critical_css() {
	add_action('wp_enqueue_scripts', function()
	{
		echo "<style>".file_get_contents( get_theme_root() . "/iosi-global/critical.css")."</style>";
		defer_style("nv-framework");
		defer_style("newamerykah-css");

	}, 1001);
}










function wpdt_header_style() {}
function wpdt_content_nav() {}

function getIPAddress() {  
	//whether ip is from the share internet  
	if(!empty($_SERVER['HTTP_CLIENT_IP'])) {  
		$ip = $_SERVER['HTTP_CLIENT_IP'];  
	}
	//whether ip is from the proxy  
	elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {  
		$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];  
	}  
	//whether ip is from the remote address  
	else{  
		$ip = $_SERVER['REMOTE_ADDR'];  
	}  
	return $ip;  
} 















function disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' ); 
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' ); 
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
	add_filter( 'wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2 );
}
add_action( 'init', 'disable_emojis' );
 
/**
 * Filter function used to remove the tinymce emoji plugin.
 * 
 * @param array $plugins 
 * @return array Difference betwen the two arrays
 */
function disable_emojis_tinymce( $plugins ) {
	if ( is_array( $plugins ) ) {
		return array_diff( $plugins, array( 'wpemoji' ) );
	} else {
		return array();
	}
}
 
/**
 * Remove emoji CDN hostname from DNS prefetching hints.
 *
 * @param array $urls URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed for.
 * @return array Difference betwen the two arrays.
 */
function disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
	if ( 'dns-prefetch' == $relation_type ) {
	/** This filter is documented in wp-includes/formatting.php */
		$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );

		$urls = array_diff( $urls, array( $emoji_svg_url ) );
	}

	return $urls;
} 
?>