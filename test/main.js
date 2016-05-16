'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:app', function () {
  var props = {
    name: 'my addin'
  };

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', done);
  });

  it('creates config', function () {
    var js = fs.readFileSync('app/scripts/main.js', 'utf8');
    assert.equal(true, js.indexOf('geotab.addin.myAddin') > -1);
    assert.equal(true, js.indexOf('#myAddin') > -1);
  });
});
