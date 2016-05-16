'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:bower.json', function () {
  var props = {
    name: 'my addin'
  }, config;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', function () {
        config = JSON.parse(fs.readFileSync('bower.json', 'utf8'));
        done();
      });
  });

  it('has correct name', function () {
    assert.equal(config.name, 'myaddin');
  });
});
