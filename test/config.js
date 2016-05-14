'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:app', function () {
  var props = {
    name: 'my addin',
    path: 'GettingStartedLink/',
    menuName: 'my addin button',
    supportEmail: 'zom@bie.com'
  };

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', done);
  });

  it('creates config', function () {
    var config = JSON.parse(fs.readFileSync('app/config.json', 'utf8'));
    assert.equal(config.name, props.name);
    assert.equal(config.supportEmail, props.supportEmail);
    assert.equal(config.items[0].url, 'myAddin.html');
    assert.equal(config.items[0].menuName.en, props.menuName);
    assert.equal(config.items[0].path, props.path);
    assert.equal(config.dev.root, 'myAddin');
  });
});
