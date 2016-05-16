'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:config.json', function () {
  var props = {
    name: 'my addin',
    path: 'GettingStartedLink/',
    menuName: 'my addin button',
    supportEmail: 'zom@bie.com'
  }, config;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', function () {
        config = JSON.parse(fs.readFileSync('app/config.json', 'utf8'));
        done();
      });
  });

  it('has correct name', function () {
    assert.equal(config.name, props.name);
  });
  it('has correct email', function () {
    assert.equal(config.supportEmail, props.supportEmail);
  });
  it('has correct url', function () {
    assert.equal(config.items[0].url, 'myAddin.html');
  });
  it('has correct menu name', function () {
    assert.equal(config.items[0].menuName.en, props.menuName);
  });
  it('has correct path', function () {
    assert.equal(config.items[0].path, props.path);
  });
  it('has correct root id', function () {
    assert.equal(config.dev.root, 'myAddin');
  });
});
