# generator-addin [![NPM version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/Geotab/generator-addin.svg?branch=master)](https://travis-ci.org/Geotab/generator-addin)

> Yeoman generator for MyGeotab/Geotab Drive add-ins

## Features

Leverage modern package managers.

- [NPM](https://www.npmjs.com/)

### Local Debugging

- Run and debug the add-in localy without having to add to test database. MyGeotabApi mocks the API object passes to add-in to make requests to you test database.
- Mock state - Drive add-in will try to use HTML5 features to mock Andoid/IOS device features (ex. Geolocation)
- Automagically lint your scripts
- Built-in preview server with Webpack's development server
- Webpack makes use of [ES2015 features](https://babeljs.io/docs/learn-es2015/) by using [Babel](https://babeljs.io) loaders

### Release Build Process

- Automagically lint your scripts
- Minify, Obfuscate and Image optimization
- Sandbox CSS as to not effect parent document CSS
- Convert URLs to deployment location

### Unit testing

- Spec testing with [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/)
- Functional testing with [Puppeteer](https://pptr.dev/)

## Getting Started

- Install dependencies: `npm install -g yo`
- Install the generator: `npm install -g generator-addin`
- Create a directory for your project `mkdir <projdir>`
- Change to your project `cd <projdir>`
- Run `yo addin` to scaffold your addin
- Run `npm run serve` to preview and watch for changes
- Run `npm install <package>` to install frontend dependencies
- Run `npm run test:serve` to run the tests
- Run `npm run build` to build your addin for production

## Documentation

For information on MyGeotab and Geotab Drive addins or the MyGeotab API head over to the [MyGeotab SDK](https://my.geotab.com/sdk/default.html)

## License

Apache-2.0 © [Geotab Inc](https://geotab.com)

[npm-image]: https://badge.fury.io/js/generator-addin.svg
[npm-url]: https://npmjs.org/package/generator-addin
[travis-image]: https://travis-ci.org/geotab/generator-addin.svg?branch=master
[travis-url]: https://travis-ci.org/geotab/generator-addin
