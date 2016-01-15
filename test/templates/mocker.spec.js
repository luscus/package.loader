/* jshint node:true */
/* jshint expr:true*/
/* global describe */
/* global it */
'use strict';

require('chai').should();

var dependencies = require('../../lib/tools/dependencies'),
    aliases      = require('../../lib/tools/aliases'),
    mocked       = require('../../lib/data/mocked'),
    mocker       = require('../../lib/templates/mocker')({}),
    loader       = require('../../lib/package.loader');


describe('[' + __filename.substring(__filename.indexOf('/test/') + 1) + '] - mocker ', function() {

  it('mock should be a method', function(){
    loader.mock.should.be.a('function');
  });

  it('mockInRoot should be a method', function(){
    loader.mockInRoot.should.be.a('function');
  });

  it('mockInExternal should be a method', function(){
    loader.mockInExternal.should.be.a('function');
  });

  it('isMocked should be a method', function(){
    loader.isMocked.should.be.a('function');
  });


  it('mock a method in self', function(){
		var selfMockResponse = 'loader.self called',
        packagePath      = dependencies.getPackagePath(aliases.SELF.path, 'loader.self');

    // set mocked package
		loader.mock('loader.self', function () {
			return selfMockResponse;
		});

    // check data structures
    mocked.should.have.property(packagePath);
    aliases.SELF.installed.indexOf('loader.self').should.be.ok;

    // load mocked package
    var self = loader.require('loader.self');

    self.should.be.a('function');
		self().should.equal(selfMockResponse);
  });

  it('mock a method in root', function(){
    var rootMockResponse = 'loader.root called',
        packagePath      = dependencies.getPackagePath(aliases.ROOT.path, 'loader.root');

    // set mocked package
    loader.mockInRoot('loader.root', function () {
      return rootMockResponse;
    });

    // check data structures
    mocked.should.have.property(packagePath);
    aliases.ROOT.installed.indexOf('loader.root').should.be.ok;

    var root = loader.requireFromRoot('loader.root');

    // load mocked package
    root.should.be.a('function');
    root().should.equal(rootMockResponse);
  });

  it('mock a method in external', function(){
    var externalMockResponse = 'loader.external called',
        packagePath      = dependencies.getPackagePath(aliases.EXTERNAL.path, 'loader.external');

    // set mocked package
    loader.mockInExternal('loader.external', function () {
      return externalMockResponse;
    });

    // check data structures
    mocked.should.have.property(packagePath);
    aliases.EXTERNAL.installed.indexOf('loader.external').should.be.ok;

    var root = loader.requireFromExternal('loader.external');

    // load mocked package
    root.should.be.a('function');
    root().should.equal(externalMockResponse);
  });


  it('check if package "loader.root" is a mock', function(){
    var packagePath      = dependencies.getPackagePath(aliases.ROOT.path, 'loader.root');

    loader.isMocked(packagePath).should.be.true;

    loader.isMocked('').should.be.false;
    loader.isMocked(undefined).should.be.false;
    loader.isMocked(null).should.be.false;
  });

  it('should be able to remove one mock', function(){

    mocker.removeMock('loader.plugin.one', aliases.SELF);
    aliases.ROOT.installed.indexOf('loader.plugin.one').should.be.equals(-1);
  });

  it('should be able to remove all mocks', function(){

    mocker.removeMocks();
    aliases.ROOT.installed.indexOf('loader.plugin.one').should.be.equals(-1);
  });
});
