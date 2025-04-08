# Tyson Migration Debugger

A WordPress Must-Use (MU) plugin for debugging asset issues during migrations to wp-scripts via StellarWP's Tyson.

## Description

Tyson Migration Debugger is a utility plugin that helps identify and debug asset-related issues during migrations. It integrates with Query Monitor to provide detailed diagnostics for StellarWP Assets.

## Features

- Validates that registered assets exist in the filesystem
- Verifies assets are located in the expected build directories
- Provides error messages through Query Monitor for missing assets
- Throws exceptions for critical issues when Query Monitor is not available

## Requirements

- WordPress
- StellarWP Assets 1.4.6 or later
- Query Monitor plugin (recommended for better debugging output)

## Configuration

The plugin only activates when `STELLARWP_ASSETS_DEBUG` is defined and set to true. To enable:

```php
// Add to wp-config.php or another configuration file
define( 'STELLARWP_ASSETS_DEBUG', true );
```

## How It Works

The plugin hooks into WordPress's `shutdown` action and:

1. Retrieves all registered StellarWP Assets
2. Validates that assets point to local files (skips CDN/remote resources)
3. Verifies assets are located in a build directory
4. Confirms the asset files actually exist in the filesystem
5. Reports issues through Query Monitor or exceptions

## Usage

Simply install this plugin in your WordPress `mu-plugins` directory and enable the `STELLARWP_ASSETS_DEBUG` constant. Errors and warnings will be reported in Query Monitor or as exceptions.
