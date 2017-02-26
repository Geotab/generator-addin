'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var commonFiles = [
  'bower.json',
  'gulpfile.babel.js',
  'package.json',
  'app/config.json',
  'app/images/icon.svg',
  'test/functional/test.js',
  'test/functional/mocks/mocks.js',
  '.dev/api.js',
  '.dev/login.js',
  '.dev/login.html',
  '.dev/rison.js',
  '.dev/style/styleGuide.css',
  '.dev/style/styleGuideMyGeotab.html'
];

describe('generator-addin:page', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'my addin',
        type: 'MyGeotabPage'
      })
      .on('end', done);
  });

  it('creates files for add-in page', function () {
    assert.file(commonFiles.concat([
      'app/myAddin.html',
      'app/scripts/main.js',
      'app/styles/main.css'
    ]));
  });
});

describe('generator-addin:button', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'my addin',
        type: 'MyGeotabButton'
      })
      .on('end', done);
  });

  it('creates files for add-in button', function () {
    assert.file(commonFiles.concat([
      '.dev/button.html',
      'app/myAddin.js'
    ]));
  });
});
