var should  = require('chai').should(),
    finder  = require('../lib/package.module.finder');

describe('Mock root dependencies:', function(){
  var rootPackage = function (_app) {

    _app.mixin = 'application.mixin.test';

    return _app;
  };

  finder.mock('application.mixin.test', rootPackage);

  var mixin       = finder.require('application.mixin.test'),
      application = mixin({id: 'test'});

  it('mocked dependency is a Function', function(){
    mixin.should.be.a('function');
  });

  it('application has an "id" property', function(){
    application.should.have.property('id', 'test');
  });

  it('application has an "mixin" property', function(){
    application.should.have.property('mixin', 'application.mixin.test');
  });
});
