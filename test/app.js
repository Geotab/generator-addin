'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-addin:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'my addin'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'gulpfile.babel.js',
      'package.json',
      'app/myAddin.html',
      'app/config.json',
      'app/images/icon.svg',
      'app/scripts/main.js',
      'app/styles/main.css',
      'test/functional/test.js',
      'test/functional/mocks/mocks.js',
      '.dev/api.js',
      '.dev/login.js',
      '.dev/login.html',
      '.dev/rison.js',
      '.dev/style/styleGuide.css',
      '.dev/style/styleGuideMyGeotab.html'
    ]);
  });
});
