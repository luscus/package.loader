/* jshint node:true */
/* jshint expr:true*/
/* global describe */
/* global before */
/* global it */
'use strict';

require('chai').should();

var expect    = require('chai').expect;
var loader    = require('../../lib/templates/loader')({});
var dependencies = require('../../lib/tools/dependencies');
var crawler   = require('../../lib/tools/crawler');
var loaderLib = require('../../lib/package.loader');
var mocker    = require('../../lib/templates/mocker')({});
var mocked    = require('../../lib/data/mocked');
var allData   = require('../../lib/data/hierarchy');

// rerun in dev mode
crawler.crawl(true);

// adding mocked packages
var fakePlugins = ['loader.plugin.one', 'loader.plugin.two', 'loader.plugin.three', 'cached.plugin'];

fakePlugins.forEach(function pluginIterator (pluginName) {
  loaderLib.mock(pluginName, function () {
    return pluginName + '.self';
  });

  loaderLib.mockInRoot(pluginName + '.root', function () {
    return pluginName + '.root';
  });

  loaderLib.mockInExternal(pluginName + '.external', function () {
    return pluginName + '.external';
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


  describe('private method removePackageFromCache', function() {
    var mockedPackage = function () {return 'obsolete package';};

    before(function (done) {
      loaderLib.mock('obsolete.package', mockedPackage);
      done();
    });

    it('should be a method', function () {
      loader.removePackageFromCache.should.be.a('function');
    });

    it('should delete mocked cache', function () {
      var packageValue = loaderLib.require('obsolete.package');
      packageValue().should.equal('obsolete package');

      var packagePath = dependencies.getPackagePath(loaderLib.SELF.path, 'obsolete.package');


      loader.removePackageFromCache(packagePath);
      expect(mocked[packagePath]).to.deep.equal(mockedPackage);
      expect(require.cache[packagePath]).to.equal(undefined);
    });

    it('should delete package cache', function () {
      var packagePath = dependencies.getPackagePath(loaderLib.SELF.path, 'gulp');

      loader.removePackageFromCache(packagePath);
      expect(require.cache[packagePath]).to.equal(undefined);
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
        .and.to.equal('loader.plugin.two.self');
    });

    it('should require from provided name: loader.plugin.one', function() {
      var plugin = loader.requirePackage('loader.plugin.one', loaderLib.SELF);

      expect(plugin())
        .to.be.a('string')
        .and.to.equal('loader.plugin.one.self');
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

  describe('package cache management', function() {

    describe('clear cache', function() {

      it('should have a method "unload"', function () {
        loaderLib.unload.should.be.a('function');
      });

      it('should have a method "unloadFromRoot"', function () {
        loaderLib.unloadFromRoot.should.be.a('function');
      });

      it('should have a method "unloadFromExternal"', function () {
        loaderLib.unloadFromExternal.should.be.a('function');
      });

      it.skip('should remove ', function () {
        var plugin = loaderLib.load(/^cached.plugin.*/);

        console.log('allDatat',allData);
        console.log(loaderLib.EXTERNAL, plugin);

        expect(plugin())
            .to.be.a('string')
            .and.to.equal('loader.plugin.two');
      });

      it('should require from provided name: loader.plugin.one', function () {
        var plugin = loader.requirePackage('loader.plugin.one', loaderLib.SELF);

        expect(plugin())
            .to.be.a('string')
            .and.to.equal('loader.plugin.one.self');
      });
    });
  });

});
