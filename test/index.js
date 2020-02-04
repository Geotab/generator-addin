'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:index.html', function () {
  var props = {
      name: 'my addin',
      path: '',
      type: 'MyGeotabPage'
    },
    js;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', done);
  });

  it('has correct file name', function () {
    js = fs.readFileSync('src/app/myAddin.html', 'utf8');
    assert.equal(true, !!js);
  });
  it('has correct title', function () {
    assert.equal(true, js.indexOf('<title>my addin</title>') > -1);
  });
  it('has correct selector', function () {
    assert.equal(true, js.indexOf('id="myAddin"') > -1);
  });

});

describe('generator-addin:index.html MyGeotab', function () {
  var props = {
      name: 'my addin',
      path: ''
    },
    js;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', done);
  });

  it('has correct ontent for MyGeotab Add-in', function () {
    js = fs.readFileSync('src/app/myAddin.html', 'utf8');
    assert.equal(true, js.indexOf('<header class="geotabPageHeader">') > -1);
  });

});

describe('generator-addin:index.html Drive', function () {
  var props = {
      name: 'my addin',
      path: 'DriveAppLink/',
      type: 'DrivePage'
    },
    js;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', done);
  });

  it('has correct ontent for Drive Add-in', function () {
    js = fs.readFileSync('src/app/myAddin.html', 'utf8');
    assert.equal(true, js.indexOf('<h2 class="panel__title">') > -1);
  });

});
