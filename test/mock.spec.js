var Path     = require('path'),
    should   = require('chai').should(),
		loader   = require('../lib/package.loader');


describe('Mocking:', function(){

  it('mock should be a method', function(){
    loader.mock.should.be.a('function');
  });

  it('mockInParent should be a method', function(){
    loader.mockInParent.should.be.a('function');
  });

  it('mockInRoot should be a method', function(){
    loader.mockInRoot.should.be.a('function');
  });


  it('mock a method in self', function(){
		var selfMockResponse = 'loader.self called';

		loader.mock('loader.self', function () {
			return selfMockResponse;
		});

    var self = loader.require('loader.self');


    self.should.be.a('function');
		self().should.equal(selfMockResponse);
  });

  it('mock a method in parent', function(){
		var selfMockResponse = 'loader.parent called';

		loader.mockInParent('loader.parent', function () {
			return selfMockResponse;
		});

    var parent = loader.requireFromParent('loader.parent');


    parent.should.be.a('function');
		parent().should.equal(selfMockResponse);
  });

  it('mock a method in root', function(){
		var selfMockResponse = 'loader.root called';

		loader.mockInRoot('loader.root', function () {
			return selfMockResponse;
		});

    var root = loader.requireFromRoot('loader.root');


    root.should.be.a('function');
		root().should.equal(selfMockResponse);
  });

});
