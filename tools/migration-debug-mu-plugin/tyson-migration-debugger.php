<?php
/**
 * Plugin Name: Tyson Migration Debugger
 */

use TEC\Common\StellarWP\Assets\Assets;

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'STELLARWP_ASSETS_DEBUG' ) || ! STELLARWP_ASSETS_DEBUG ) {
    return;
}

add_action( 'shutdown', function () {
    $assets = Assets::init();
    $all_registered_assets = $assets->get();

    foreach ( $all_registered_assets as $asset ) {
        if ( ! is_callable( [ $asset, 'get_full_resource_path' ] ) ) {
            do_action( 'qm/critical', 'Update your version of StellarWP Assets!' );
            break;
        }

        $full_path = $asset->get_full_resource_path();

        if ( strstr( $full_path, 'http://' ) || strstr( $full_path, 'https://' ) ) {
            continue;
        }

        $is_in_build_dir = strstr( $full_path, 'build' );

        if ( ! $is_in_build_dir ) {
            do_action( 'qm/debug', 'Asset not in build directory: `' . $asset->get_full_resource_path() . '`' );
        }

        if ( file_exists( $full_path ) ) {
            continue;
        }

        if ( ! has_action( 'qm/critical' ) ) {
            throw new Exception( 'Asset not found: ' . $asset->get_full_resource_path() );
        }

        do_action( 'qm/critical', 'Asset not found: `' . $asset->get_full_resource_path() . '`' );
    }
}, 9 );
