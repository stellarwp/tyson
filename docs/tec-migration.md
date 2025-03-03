## Converting a plugin to use tyson and wp-scripts

### Update the node version to 18.17.0

Set, in the plugin `.nvmrc` file, the version of `node` used by the plugin to `18.17.0`:

```bash
echo "18.17.0" > .nvmrc
```

Use, after installing it if required, the new `node` version:

```bash
nvm install $(cat .nvmrc)
nvm use
```

### Require the @wordpress/scripts package as a development dependency

Add `@wordpress/scripts` as a development dependency in the plugin `package.json` file:

```bash
npm install --save-dev @wordpress/scripts 
```

There _should_ not be conflicts with the `@wordpress/scripts` package.

If there are, provisionally remove the conflicting packages from the plugin `package.json` file to deal with them later.

### Removing products-taskmaster, installing stellarwp/tyson

Remove the plugin dependency on the `@the-events-calendar/product-taskmaster` package and replace it with the dependency
on
the `@stellarwp/tyson` package:

```diff
  "dependencies": {
 -  "@the-events-calendar/product-taskmaster": "^4.0.0",
 +  "@stellarwp/tyson": "*"
  }
```

**Note**: if you're working on the development of the `@stellarwp/tyson` package, or just want to use its source code
without installing it from the `npm`, then install the `@stellarwp/tyson` using `npm link` (in the example below the
`stellarwp/tyson` package has been cloned in the `~/repos/stellarwp/tyson` directory):

```bash
cd ~/repos/stellarwp/tyson && npm link
cd ~/repos/tec/event-tickets && npm link @stellarwp/tyson
```

This will work, in effect, as if you had installed `@stellarwp/tyson` from `npm` with the command:

```bash
npm install @stellarwp/tyson
```

Again, there _should_ not be conflicts when installing `@stellarwp/tyson`.  
If there are provisionally remove the conflicting packages from the plugin `package.json` file to deal with them later.

### Removing packages already installed along with @worpdress/scripts

Less installed packages means less current and compatibility issue now and in the future.

To detect packages that can be removed from the plugin `package.json` use the `listDependencies` script from the
`tools` directory of the `stellarwp/tyson` package.

If you did not already, clone the repository to your machine:

```bash
cd ~/repos
git clone https://github.com/stellarwp/tyson
cd tyson
```

Assuming you've cloned the `stellarwp/tyson` repository to the `~/repos/stellarwp/tyson` directory and that you're
working on the Event Tickets plugin in the `~/repos/tec/event-tickets` directory:

```bash
node ~/repos/stellarwp/tyson/tools/listDependencies.js all \
  | xargs -I{} node ~/repos/stellarwp/tyson/tools//checkIncluded.js @wordpress/scripts {} \
  | grep -v NOT
```

The above command will all packages, from both the `dependencies` and `devDependencies` sections of the plugin's
`package.json`, that are also included in `@wordpress/scripts`. The output is then piped to a script that will check if
the package is already installed in the plugin's `package.json` and remove it from the list if it is. Finally, the
output
is filtered to only show packages that are not included in `@wordpress/scripts`.

In short, any package that is already installed by the `@wordpress/scripts` package should be removed from the plugin
`package.json` file.

### Creating the custom WebPack configuration file

Remove the plugin `webpack.config.js` file, it will be replaced by one scaffolded by the `@stellarwp/tyson` package.

Now run the `tyson` script that will scaffold the custom WebPack configuration file for a TEC plugin:

```bash
node_modules/.bin/tyson init --preset tec
```

You will be asked to define a namespace for the compiled assets, pick one that starts with `tec.` and follows the
`camelCase` naming convention; e.g. `tec.events.myPlugin` or `tec.tickets.myPlugin`.

The custom configuration file is composed of different presets and tweaks to accomodate for TEC peculiar practices and
ile organization.

Before you delve into the code, some key concepts:

* every JS and CSS asset will be built using `@wordpress/scripts` in the plugin `/build` directory.
* in WebPack terms, an "entry" (point) is the source of a module, an "output" (package) is the built module
* `@stellarwp/tyson` dynamically defines entry points and outputs that are fed to the compilation steps of
  `@wordpress/scripts`
* the existing PHP code that registers and enqueues assets from the `/src` directory must be updated to load them from
  the `/build` directory.
* some JS and CSS code will require updating to comply with possible new dependencies

### Legacy Javascript files

If the plugin you're working on does not include a `src/resources/js` directory, you can skip this section. If you skip
this section, then remove, from the `webpack.config.js` file, in the `customEntryPoints` object, the section using the
`TECLegacyJs` schema.

If legacy Javascript files exist, they should live in the `src/resource/js` directory. If this is the case, you're done
here, no changes are required.

If the legacy Javascript files live in a different location, then you will need to update the `webpack.config.js` file:

```diff
const customEntryPoints = compileCustomEntryPoints({
-  '/src/resources/js': TECLegacyJs,
+  '/some-other-location/js': TECLegacyJs,
});
```

If there is more than one location where legacy Javascript files exist, then you will need to add all possible locations
to the `customEntryPoints` object:

```diff
const customEntryPoints = compileCustomEntryPoints({
   '/src/resources/js': TECLegacyJs,
+  '/some-other-location/js': TECLegacyJs,
});
```

### Legacy PostCSS files

If the plugin you're working on does not include a `src/resources/postcss` directory, you can skip this section. If you
skip
this section, then remove, from the `webpack.config.js` file, in the `customEntryPoints` object, the section using the
`TECPostCss` schema.

If the legacy PostCSS files exist, they should live in the `src/resources/postcss` directory. If this is the case,
you're done
here, no changes are required.

If the legacy PostCSS files live in a different location, then you will need to update the `webpack.config.js` file:

```diff
const customEntryPoints = compileCustomEntryPoints({
-  '/src/resources/postcss': TECPostCss,
+  '/some-other-location/postcss': TECPostCss,
});
```

If there is more than one location where legacy PostCSS files live, then you will need to update the `webpack.config.js`
file:

```diff
const customEntryPoints = compileCustomEntryPoints({
   '/src/resources/postcss': TECPostCss,
+  '/some-other-location/postcss': TECPostCss,
});
```

### Legacy Blocks frontend CSS

The Legacy Blocks implementation put the legacy blocks frontend styles, the one used to render the Blocks on the site
frontend, in the `src/styles` directory.

If the plugin you're working on does not include a `src/styles` directory, you can skip this section. If you skip this
section, then remove, from the `webpack.config.js` file, in the `customEntryPoints` object, the section using the
`TECLegacyBlocksFrontendPostCss` schema.

If the directory exists, then you're done here, no changes are required.

If the directory exists, but at another path, then you will need to update the `webpack.config.js` file:

```diff
const customEntryPoints = compileCustomEntryPoints({
-  '/src/styles': TECLegacyBlocksFrontendPostCss,
+  '/some-other-location/styles': TECLegacyBlocksFrontendPostCss,
});
```

If there is more than one location for the legacy blocks frontend styles, you will need to update the
`webpack.config.js` file:

```diff
const customEntryPoints = compileCustomEntryPoints({
   '/src/styles': TECLegacyBlocksFrontendPostCss,
+  '/some-other-location/styles': TECLegacyBlocksFrontendPostCss,
});
```

### Packages

Some plugins will use packages to be compiled into modules. These will live in the `src/packages`
directory.

If the plugin you're working on does not include a `src/packages` directory, you can skip this section. If you skip this
section, then remove, from the `webpack.config.js` file, in the `customEntryPoints` object, the section using the
`TECPackage` schema.

If you do have a `src/packages` directory, then you're done here, no changes are required.

If the directory exists, but at another path, then you will need to update the `webpack.config.js` file:

```diff
const customEntryPoints = compileCustomEntryPoints({
-  '/src/packages': TECPackage,
+  '/some-other-location/packages ': TECPackage,
});
```

If there is more than one location for the packages, then you will need to update the `webpack.config.js` file:

```diff
const customEntryPoints = compileCustomEntryPoints({
   '/src/packages': TECPackage,
+  '/some-other-location/packages ': TECPackage,
});
```

### Legacy Block Editor application

If the plugin you're migrating does not implements a legacy block editor application in the `/src/modules/index.js`
file,
you can skip this section; remove the Legacy Blocks application section from the `webpack.config.js` file:

```js
-customEntryPoints['app/main'] = exposeEntry('tec.common.app.main', __dirname + '/src/modules/index.js');
```

If the plugin you're working on includes the legacy Blocks application, then you're done, no changes are required.

If the legacy Blocks application lives at another path, then update the `webpack.config.js` file:

```js
-customEntryPoints['app/main'] = exposeEntry('tec.common.app.main', __dirname + '/src/modules/index.js');
+customEntryPoints['app/main'] = exposeEntry('tec.common.app.main', __dirname + '/some/other/path/index.js');
```

Some plugins define more than one legacy Blocks application, in this case define more than one legacy blocks entrypoint;
below is an example from The Events Calendar that defines a main application and a widgets application:

```js
// The main legacy Blocks application.
customEntryPoints['app/main'] = exposeEntry('tec.common.app.main', __dirname + '/src/modules/index.js');

// The widgets application.
customEntryPoints['app/widgets'] = exposeEntry('tec.common.app.widgets', __dirname + '/src/modules/widgets/index.js');
```

### SVG compilation

By default, the `@wordpress/scripts` library will compile SVGs to React components and, whil doing so, will prefix their
`class` and `id` attributes to avoid conflicts with other elements on the page.  
This is technically correct, but TEC SVGs are already properly namespaced; you will see a section in the
`webpack.config.js` file to deal with this:

```js
doNotPrefixSVGIdsClasses(defaultConfig);
```

This section can be removed if the plugin you're working on does not include at least one SVG.

### Before the first build

Before you build the assets for the first time, remove the assets from their currently compiled location, namely (
depending on the plugin):

* `src/resources/css`
* `src/resources/js/app`

And, in general, any other built asset and directory from the previous build system.

Now delete the `node_modules` and installation files depending on the previous build system:

```bash
rm -rf node_modules package-lock.json babel.config.json
npm i
```

Now try and build the assets using `wp-scripts` and check on the reported errors.

This guide cannot possibly provide you with all the information required to fix the errors, and you will have to read'
the output carefully and enter a trial and error loop until the build succeeds without errors.

Some common issues:

#### Start from the first error

When presented with a wall of error, start tackling errors from the first at the top of the report. This will entail
some copious scrolling at times, but will help you in fixing the root errors before you waste time on the "leaf" errors.

#### Image not found

In PostCSS assets, images are not found - these will generate and `ERROR` in the build output with a message like "
Can't resolve ... ***.svg ..." depending on the image name and type.
Look at the offending file and modify the path to resolve correctly from the PostCSS file location to the image
location:

```diff
.tec-admin-page__icon--stars {
-	background-image: url('../images/icons/stars.svg');
+	background-image: url('../../../images/icons/stars.svg');
}
```

### Loading assets from the /build directory

TODO

[1]: https://github.com/stellarwp/tyson-tools
