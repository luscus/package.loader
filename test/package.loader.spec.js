/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var loaderLib   = require('../lib/package.loader');


describe('Loader Library:', function() {

  it('should have property "hierarchy"', function(){
    loaderLib.should.have.property('hierarchy');
    loaderLib.hierarchy.should.be.an('array');
  });

  it('should have property "ROOT"', function(){
    loaderLib.should.have.property('ROOT');
    loaderLib.ROOT.should.be.an('object');
  });

  it('should have property "SELF"', function(){
    loaderLib.should.have.property('ROOT');
    loaderLib.SELF.should.be.an('object');
  });

  it('match should be a method', function(){
    loaderLib.match.should.be.a('function');
  });

  it('matchInRoot should be a method', function(){
    loaderLib.matchInRoot.should.be.a('function');
  });

  it('mock should be a method', function(){
    loaderLib.mock.should.be.a('function');
  });

  it('mockInRoot should be a method', function(){
    loaderLib.mockInRoot.should.be.a('function');
  });

  it('isMocked should be a method', function(){
    loaderLib.isMocked.should.be.a('function');
  });

  it('load should be a method', function() {
    loaderLib.load.should.be.a('function');
  });

  it('loadFromRoot should be a method', function() {
    loaderLib.loadFromRoot.should.be.a('function');
  });

  it('require should be a method', function() {
    loaderLib.require.should.be.a('function');
  });

  it('requireFromRoot should be a method', function() {
    loaderLib.requireFromRoot.should.be.a('function');
  });

});
