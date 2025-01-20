# Tyson (WIP!)

**This is a work in progress! It should not be used in production.**

Create and manage custom configurations to build projects with `@wordpress/scripts.`

## This is not a wrapper of `@wordpres/scripts`

Tyson does not wrap `@wordpress/scripts` or its commands.

Instead, it provides a utility to create and maintain customized configuration files for your project to allow you to
use `@wordpress/scripts` to build and package it.

Tyson comes with a number of **configuration presets** used by StellarWP teams.

Each configuration preset is composed of **configuration schemas** and **tweaks**.

Configuration sets, schemas and tweaks might fit your use case or not. You are free to use them or ignore them.

## Installation

To install `@stellarwp/tyson`, you can use `npm` or `yarn`.

Navigate to your project directory and run one of the following commands:

Using `npm`:

```bash
npm install @stellarwp/tyson --save-dev
```

Using `yarn`:

```bash
yarn add @stellarwp/tyson --dev
```

While installing Tyson, and with it the `@wordpress/scripts` package, you might run into issues with incompatible
dependencies, especially if your project is using old versions of libraries used by `@wordpress/scripts`.
Dealing with these incompatibilities is not something Tyson can do for you: each project is different and has its
own quirks.

Take courage in knowing that, once you've solved the issues, the hardest part is likely done.

## Usage

This package provides a `tyson` binary that will be placed under your project's `bin/` folder when you install it.

Whenever you need help or information about available options, you can run:

```bash
node_modules/.bin/tyson --help
```

### Initializing a new project

Initialize your custom `webpack.config.js` file using the default configuration:

```bash
node_modules/.bin/tyson init
```

The default configuration will scaffold a `webpack.config.js` file that will allow you to customize the behaviour
of the [`@wordpress/scripts` library][1].
By default, `tyson` will not use any configuration preset and will scaffold a `webpack.config.js` file that will **not**
customize the behaviour in any meaningful way, but it will provide commented examples of how you could do it using the
facilities provided by Tyson.

By default `@wordpress/scripts` will build [from the `/src` directory to the `/build` one][2].

If a `webpack.config.js` file already exists in your project, `tyson` will **not** overwrite it and will instead print
the contents of the file it would have written to the terminal, so that you can inspect it and decide whether or not you
want to use it.

If you want to force overwriting the existing file, you can use the `--force` option:

```bash
node_modules/.bin/tyson init --force
```

WIP

## Development

If you want to work on the project, start by cloning it on your local machine:

```bash
git clone git@github.com:stellarwp/tyson.git
cd tyson
```

Install the project dependencies using the Node version specified in the `.nvmrc` file that comes with the project (
using [`nvm`][3] is suggested):

```bash
nvm use
npm install
```

While you're working on the project, use the `start` script to recompile the package to the `/dist` directory on change:

```bash
npm run start
```

Update the project as required, then run the `pre-commit` script to make sure all works as intended:

```bash
npm run pre-commit
```

The script will format, build and test your code to make sure it's ready to commit.

### Testing with a real project

While working on your changes, you might need to test them in a real project (e.g. a StellarWP product).  
For this purpose you can symlink `tyson` in your project.
In the `tyson` project root directory run:

```bash
npm link
```

Navigate to your project root directory and run:

```bash
npm link @stellarwp/tyson
```

Once you've done this, you will be able to run `node_modules/.bin/tyson` from the root directory of the project you're 
using to test `tyson`.

[1]: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#provide-your-own-webpack-config

[2]: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/#build

[3]: 
