'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:main.js', function () {
  var props = {
    name: 'my addin'
  }, js;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', function () {
        js = fs.readFileSync('app/scripts/main.js', 'utf8');
        done();
      });
  });
  it('has correct name space', function () {
    assert.equal(true, js.indexOf('geotab.addin.myAddin') > -1);
  });
  it('has correct root identifier', function () {
    assert.equal(true, js.indexOf('#myAddin') > -1);
  });
});
