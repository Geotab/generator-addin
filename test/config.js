'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

describe('generator-addin:page config.json', function () {
  var props = {
      name: 'my addin',
      path: 'GettingStartedLink/',
      menuName: 'my addin button',
      supportEmail: 'zom@bie.com',
      host: 'http://eat.brains.com/myaddin'
    },
    config;

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
  it('has correct host', function () {
    assert.equal(config.dev.dist.host, props.host + '/');
  });
});

describe('generator-addin:button config.json', function () {
  var props = {
      name: 'my addin',
      page: 'map',
      type: 'MyGeotabButton',
      menuName: 'My Addin',
      supportEmail: 'zom@bie.com',
      host: 'http://eat.brains.com/myaddin'
    },
    config;

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
  it('has correct click', function () {
    assert.equal(config.items[0].click, 'scripts/myAddin.js');
  });
  it('has correct button name', function () {
    assert.equal(config.items[0].buttonName.en, props.menuName);
  });
  it('has correct page', function () {
    assert.equal(config.items[0].page, props.page);
  });
  it('has correct root id', function () {
    assert.equal(config.dev.root, 'myAddin');
  });
  it('has correct host', function () {
    assert.equal(config.dev.dist.host, props.host + '/');
  });
});

describe('generator-addin:drive config.json', function () {
    var props = {
        name: 'my addin',
        type: 'DrivePage',
        menuName: 'my drive addin',
        supportEmail: 'zom@bie.com',
        host: 'http://eat.brains.com/myaddin'
      },
      config;

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
      assert.equal(config.items[0].path, 'DriveAppLink/');
    });
    it('has correct root id', function () {
      assert.equal(config.dev.root, 'myAddin');
    });
    it('has correct host', function () {
      assert.equal(config.dev.dist.host, props.host + '/');
    });
  });
