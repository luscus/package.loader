/* jshint node:true */
/* jshint expr:true*/
/* global describe */
/* global it */
'use strict';

require('chai').should();

var expect    = require('chai').expect;
var loader    = require('../../lib/templates/loader')({}),
    crawler   = require('../../lib/tools/crawler'),
    loaderLib = require('../../lib/package.loader');

// rerun in dev mode
crawler.crawl(true);

// adding mocked packages
var fakePlugins = ['loader.plugin.one', 'loader.plugin.two', 'loader.plugin.three'];

fakePlugins.forEach(function pluginIterator (pluginName) {
  loaderLib.mock(pluginName, function () {
    return pluginName;
  });
});


describe('[' + __filename.substring(__filename.indexOf('/test/') + 1) + '] - loader ', function() {

  describe('private method resolvePackageName', function() {

    it('should have a method "resolvePackageName"', function() {
      loader.resolvePackageName.should.be.a('function');
    });

    it('should find one match with regex: /^.*two$/', function() {
      var plugin = loader.resolvePackageName(/^.*two$/, loaderLib.SELF);

      expect(plugin).to.be.a('string')
        .and.to.equal('loader.plugin.two');
    });

    it('should throw an error if more than one match was found: /^loader.plugin.*/', function() {

      expect(loader.resolvePackageName.bind(this, /^loader.plugin.*/, loaderLib.SELF))
        .to.throw('too many plugins found for regular expression');
    });

    it('should throw an error if no match was found', function() {

      expect(loader.resolvePackageName.bind(this, /^.*unknown$/, loaderLib.SELF))
        .to.throw('plugin found for regular expression');
    });
  });


  describe('private method loadPackages', function() {

    it('should have a method "loadPackages"', function() {
      loader.loadPackages.should.be.a('function');
    });

    it('should return matching packages: /^loader.plugin.(one|three)$/', function() {
      var plugins = loader.loadPackages(/^loader.plugin.(one|three)$/, loaderLib.SELF);

      expect(plugins)
        .to.be.an('object')
        .and.to.have.property('loader.plugin.one');
      expect(plugins).to.have.property('loader.plugin.three');
    });

    it('should 1. return an empty object if no package was found', function() {
      var plugins = loader.loadPackages(/^loader.plugin$/, loaderLib.SELF);

      expect(plugins)
        .to.be.an('object')
        .and.to.deep.equal({});
    });

    it('    OR 2. optionally throw an error if no package was found', function() {

      expect(loader.loadPackages.bind(this, /^.*unknown$/, loaderLib.SELF, true))
        .to.throw('no plugin found for regular expression');
    });
  });


  describe('private method requirePackage', function() {

    it('should have a method "requirePackage"', function() {
      loader.requirePackage.should.be.a('function');
    });

    it('should require from provided regex: /^.*two$/', function() {
      var plugin = loader.requirePackage(/^.*two$/, loaderLib.SELF);

      expect(plugin())
        .to.be.a('string')
        .and.to.equal('loader.plugin.two');
    });

    it('should require from provided name: loader.plugin.one', function() {
      var plugin = loader.requirePackage('loader.plugin.one', loaderLib.SELF);

      expect(plugin())
        .to.be.a('string')
        .and.to.equal('loader.plugin.one');
    });
  });

  describe('public loading mixins', function() {
    it('load should be a method', function () {
      loaderLib.load.should.be.a('function');

      var plugins = loaderLib.load(/chai/);

      expect(plugins).to.have.property('chai');
    });

    it('loadFromRoot should be a method', function () {
      loaderLib.loadFromRoot.should.be.a('function');

      var plugins = loaderLib.loadFromRoot(/chai/);

      expect(plugins).to.have.property('chai');
    });

    it('loadFromExternal should be a method', function () {
      loaderLib.loadFromExternal.should.be.a('function');

      var plugins = loaderLib.loadFromExternal(/package.loader/);

      expect(plugins['package.loader'])
        .to.equal(loaderLib);
    });
  });

  describe('public requiring mixins', function() {
    it('require should be a method', function () {
      loaderLib.require.should.be.a('function');
    });

    it('requireFromRoot should be a method', function () {
      loaderLib.requireFromRoot.should.be.a('function');
    });

    it('requireFromExternal should be a method', function () {
      loaderLib.requireFromExternal.should.be.a('function');

      var plugin = loaderLib.requireFromExternal(/package.loader/);

      expect(plugin)
        .to.equal(loaderLib);
    });
  });

});
