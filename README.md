# generator-addin [![NPM version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/Geotab/generator-addin.svg?branch=master)](https://travis-ci.org/Geotab/generator-addin)

> Yeoman generator for MyGeotab/Geotab Drive add-ins

> [!IMPORTANT]
> The add-in generator currently works with Yeoman version [5.0.0](https://github.com/yeoman/yo/releases/tag/v5.0.0).
## Features

### Package Management
Leverage [NPM](https://www.npmjs.com/)

### Local Debugging

- Run and debug the add-in locally without having to add to test database. MyGeotabApi mocks the API object passes to add-in to make requests to you test database.
- Mock state - Drive add-in will try to use HTML5 features to mock Android/IOS device features (ex. Geolocation)
- Automagically lint your scripts
- Built-in preview server with Webpack's development server
- Webpack makes use of [ES2015 features](https://babeljs.io/docs/learn-es2015/) by using [Babel](https://babeljs.io) loaders

### Release Build Process

- Automagically lint your scripts
- Minify, Obfuscate and Image optimization
- Sandbox CSS as to not effect parent document CSS
- Convert URLs to deployment location

## Getting Started

### Installation
- Install dependencies: `npm install -g yo@5.0.0`
- Install the generator: `npm install -g generator-addin`
- Create a directory for your project `mkdir <projdir>`
- Change to your project `cd <projdir>`
- Run `yo addin` to scaffold your addin

### Using
- Run `npm install <package>` to install frontend dependencies
- Run `npm run dev` or `npm run serve` to preview and watch for changes
- Run `npm run build` to build your addin for production (Creates a Zip File with the production files for testing in MyG)
## Documentation

### MyGeotab

For information on MyGeotab and Geotab Drive addins or the MyGeotab API head over to the [MyGeotab SDK](https://developers.geotab.com/myGeotab/introduction)

### Addin Generator

The addin generator runs using Webpack, and makes heavy use of Webpack's ability to build out [Dependency Graphs](https://webpack.js.org/concepts/dependency-graph/). When a build is run, Webpack takes the Dependency Graph and generates a single optimized JS, CSS, and HTML file.

For more comprehensive information about Webpack, head over to the [Webpack Documentation](https://webpack.js.org/concepts/)

#### Dependencies

Webpack treats separate JavaScript files as [Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), which requires code intended to be used in `main.js` to be exported first. [Webpack's Module Support](https://webpack.js.org/guides/getting-started/#modules) will handle browser compatibility for you.

Using Webpack allows us to leverage npm and it's associated libraries. For example, running `npm install jquery` and placing `import $ from 'jquery';` in `main.js` will give you access to the jQuery library in your addin.

The [entry point](https://webpack.js.org/concepts/#entry) for the generator is `.dev/index.js` for development builds and `app/index.js` for production. Any files included in `.dev/index.js` will not be bundled into the end product. **The recommended approach** is including dependencies in `app/scripts/main.js`, as this will allow the files to be included in both production and development environments of Webpack.


#### Using with Older Addins

Many old addins run directly out of main.js, and have several references to external scripts in the main HTML page. To make old addins run with webpack, you will need to move any reference to static assets from the `*.html` file into `main.js`:

```javascript
// in app/scripts/main.js
require('../styles/main.css');
require('../styles/other.css');

// Importing a library downloaded with npm
import Vue from 'vue/dist/vue';

// Importing functions from another file
import { helper1, helper2, helper3 } from './helper.js';

```

Any files that are being imported need to be converted to [es2015 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

#### Using with Translations

To translate the addin on load, `state.translate(...)` must be called in `initialize()` and handed the addin's HTML root:
```javascript
    initialize: function (freshApi, freshState, initializeCallback) {
      // Loading translations if available
      if (freshState.translate) {
        freshState.translate(elAddin || '');
      }
      // MUST call initializeCallback when done any setup
      initializeCallback();
    }
```

You can also translate sentences by directly passing them in using `state.translate(...)`. This is useful for translating dynamically created content (IE. JavaScript): 
```javascript
    focus: function(api, state){
        document.querySelector('#app').textContent = state.translate('Translate this sentence');
    }
```

Any text that requires translation needs to be added into a `{language}.json` file, where `{language}` is a supported abbreviation.

## FAQ

**_Do I have to make a reference to the build in my html file?_**
No. Webpack handles this automatically

**_What version of node do I need?_**
We support node 17.x and above. Node v22.12.0 recommended

**_I keep getting an error telling me regeneratorRuntime is not defined. What does this mean?_**
Webpack compiles with compatibility in mind, and will attempt to transpile async functions for compatibility with older IE browsers. There is currently a bug with Webpack causing transpilations to fail unless the `regeneratorRuntime` is manually defined. Run `npm i -D regenerator-runtime` and place `const regeneratorRuntime = require('regenerator-runtime');` in the effected files

**_I keep getting an error message in the console telling me that my file was not found, but I can see it in my directory. Why?_**
This likely means that you have a reference to the file in your main HTML file. Remove this reference and instead import the file in `main.js`.

## License

Apache-2.0 © [Geotab Inc](https://geotab.com)

[npm-image]: https://badge.fury.io/js/generator-addin.svg
[npm-url]: https://npmjs.org/package/generator-addin
[travis-image]: https://travis-ci.org/geotab/generator-addin.svg?branch=master
[travis-url]: https://travis-ci.org/geotab/generator-addin
