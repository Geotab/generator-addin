'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:index.html', function () {
  var props = {
    name: 'my addin',
    path: 'DriveAppLink/'
  }, js;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', done);
  });

  it('has correct file name', function () {
    js = fs.readFileSync('app/myAddin.html', 'utf8');
    assert.equal(true, !!js);
  });
  it('has correct title', function () {
    assert.equal(true, js.indexOf('<title>my addin</title>') > -1);
  });
  it('has correct selector', function () {
    assert.equal(true, js.indexOf('id="myAddin"') > -1);
  });

});
