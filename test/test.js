'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:test.js', function () {
  var props = {
      name: 'my addin',
      path: 'DriveAppLink/',
      type: 'DrivePage'
    },
    js;

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(props)
      .on('end', function () {
        js = fs.readFileSync('test/functional/test.js', 'utf8');
        done();
      });
  });

  it('has correct selector', function () {
    assert.equal(true, js.indexOf('#app') > -1, 'Has correct selector');
  });
  it('has device select for drive', function () {
    assert.equal(true, js.indexOf('// select a device (only part of local add-in debugging)') > -1, 'Has device select for drive');
  });
});
