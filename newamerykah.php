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

$templ_dir = plugin_dir_path();


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
        trigger_error( "Component does not exist!", E_USER_WARNING);
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


wp_enqueue_style( "newamerykah-css", "{$templ_dir}style.css" );

?>