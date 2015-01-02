/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var dependencies = require('../../lib/tools/dependencies'),
    aliases      = require('../../lib/tools/aliases'),
    mocked       = require('../../lib/tools/mocked'),
    loader       = require('../../lib/package.loader');


describe('Mocking:', function(){

  it('mock should be a method', function(){
    loader.mock.should.be.a('function');
  });

  it('mockInRoot should be a method', function(){
    loader.mockInRoot.should.be.a('function');
  });


  it('mock a method in self', function(){
		var selfMockResponse = 'loader.self called',
        packagePath      = dependencies.getPackagePath(aliases.SELF.path, 'loader.self');

		loader.mock('loader.self', function () {
			return selfMockResponse;
		});

    mocked.should.have.property(packagePath);

    var self = loader.require('loader.self');


    self.should.be.a('function');
		self().should.equal(selfMockResponse);
  });

  it('mock a method in root', function(){
		var rootMockResponse = 'loader.root called',
        packagePath      = dependencies.getPackagePath(aliases.ROOT.path, 'loader.root');

		loader.mockInRoot('loader.root', function () {
			return rootMockResponse;
		});

    mocked.should.have.property(packagePath);

    var root = loader.requireFromRoot('loader.root');


    root.should.be.a('function');
		root().should.equal(rootMockResponse);
  });

});
