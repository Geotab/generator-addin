'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var commonFiles = [
  'webpack.common.js',
  'webpack.production.js',
  'webpack.development.js',
  'package.json',
  'test/functional/test.js',
  'test/functional/mocks/mocks.js',
  'src/app/index.js',
  'src/app/config.json',
  'src/app/images/icon.svg',
  'src/.dev/api.js',
  'src/.dev/loaders/css-sandbox/css-sandbox.js',
  'src/.dev/groups/Groups.js',
  'src/.dev/groups/_GroupHelper.js',
  'src/.dev/groups/GroupListeners.js',
  'src/.dev/images/close-round.svg',
  'src/.dev/images/Font_Awesome_5_solid_chevron-left.svg',
  'src/.dev/login/loginTemplate.js',
  'src/.dev/login/loginLogic.js',
  'src/.dev/navbar/navbar.js',
  'src/.dev/navbar/NavBuilder.js',
  'src/.dev/navbar/NavFactory.js',
  'src/.dev/navbar/NavHandler.js',
  'src/.dev/navbar/props.js',
  'src/.dev/rison.js',
  'src/.dev/index.js',
  'src/.dev/styles/styleGuide.css',
  'src/.dev/styles/styleGuideMyGeotab.html'
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
      'src/app/myAddin.html',
      'src/app/scripts/main.js',
      'src/app/styles/main.css'
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
      'src/.dev/myAddin.html',
      'src/app/scripts/myAddin.js'
    ]));
  });
});
