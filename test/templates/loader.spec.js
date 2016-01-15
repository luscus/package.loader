/* jshint node:true */
/* jshint expr:true*/
/* global describe */
/* global beforeEach */
/* global before */
/* global it */
'use strict';

require('chai').should();

var expect    = require('chai').expect;
var loader    = require('../../lib/templates/loader')({});
var dependencies = require('../../lib/tools/dependencies');
var crawler   = require('../../lib/tools/crawler');
var loaderLib = require('../../lib/package.loader');
var mocked    = require('../../lib/data/mocked');
var aliases   = require('../../lib/tools/aliases');
var mocker    = require('../../lib/templates/mocker')({});
var utils     = require('../utils');

// rerun in dev mode
crawler.crawl(true);

// adding mocked packages
var fakePlugins  = ['loader.plugin.one', 'loader.plugin.two', 'loader.plugin.three'];

var levelMethods = utils.getLevelMethods(['load', 'unload', 'require'], aliases);
var aliasNames   = Object.getOwnPropertyNames(aliases);



describe('[' + __filename.substring(__filename.indexOf('/test/') + 1) + '] - loader ', function() {
  beforeEach(function (done) {
    mocker.removeMocks();
    utils.mockInAllLevels(fakePlugins, aliases);
    done();
  });

  describe('private method resolvePackageName', function() {

    it('should have a method "resolvePackageName"', function() {
      loader.resolvePackageName.should.be.a('function');
    });

    it('should find one match with regex: /^.*two\.SELF$/', function() {
      var plugin = loader.resolvePackageName(/^.*two\.SELF$/, loaderLib.SELF);

      expect(plugin).to.be.a('string')
        .and.to.equal('loader.plugin.two.SELF');
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

    it('should return matching packages: /^loader.plugin.(one.SELF|three.SELF)$/', function() {
      var plugins = loader.loadPackages(/^loader.plugin.(one.SELF|three.SELF)$/, loaderLib.SELF);

      expect(plugins)
        .to.be.an('object')
        .and.to.have.property('loader.plugin.one.SELF');
      expect(plugins).to.have.property('loader.plugin.three.SELF');
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
      var packageValue = loaderLib.require('loader.plugin.two.SELF');
      packageValue().should.equal('loader.plugin.two.SELF');

      var packagePath = dependencies.getPackagePath(loaderLib.SELF.path, 'loader.plugin.two.SELF');


      loader.removePackageFromCache(packagePath);
      expect(mocked[packagePath]).to.equal(packageValue);
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

    it('should require from provided regex: /^.*two.SELF$/', function() {
      var plugin = loader.requirePackage(/^.*two.SELF$/, loaderLib.SELF);

      expect(plugin())
        .to.be.a('string')
        .and.to.equal('loader.plugin.two.SELF');
    });

    it('should require mocked from provided name: loader.plugin.one.SELF', function() {
      var plugin = loader.requirePackage('loader.plugin.one.SELF', loaderLib.SELF);

      expect(plugin())
        .to.be.a('string')
        .and.to.equal('loader.plugin.one.SELF');
    });

    it('should require from provided name: gulp', function() {
      var plugin = loader.requirePackage('gulp', loaderLib.SELF);

      expect(plugin.isRunning)
        .to.be.a('boolean')
        .and.to.equal(true);
    });
  });

  describe('provides "require" capacities and', function() {

    levelMethods.require.forEach(function methodIterator (methodName) {
      it('should have a public method "'+methodName+'"', function () {
        loaderLib[methodName].should.be.a('function');
      });
    });

    aliasNames.forEach(function aliasIterator (alias) {
      var levelMethodName  = utils.getLevelMethodName('require', alias);
      var levelPluginName  = 'loader.plugin.one.' + alias;

      it('should require 1 package from ' + alias + ' with package name "' + levelPluginName + '"', function () {
        var plugin         = loaderLib[levelMethodName](levelPluginName);

        expect(plugin()).to.deep.equal(levelPluginName);
      });
    });

    aliasNames.forEach(function aliasIterator (alias) {
      var levelMethodName  = utils.getLevelMethodName('require', alias);
      var levelPluginName  = 'loader.plugin.one.' + alias;

      it('should force update of package from ' + alias + ' with package name "' + levelPluginName + '"', function () {
        var plugin         = loaderLib[levelMethodName](levelPluginName);

        expect(plugin()).to.equal(levelPluginName);

        mocker.mock(levelPluginName, function () {return levelPluginName + '.new';}, aliases[alias]);

        plugin         = loaderLib[levelMethodName](levelPluginName, true);
        expect(plugin()).to.equal(levelPluginName + '.new');
      });
    });
  });

  describe('provides "load" capacities and', function() {

    levelMethods.load.forEach(function methodIterator (methodName) {
      it('should have a public method "'+methodName+'"', function () {
        loaderLib[methodName].should.be.a('function');
      });
    });

    aliasNames.forEach(function aliasIterator (alias) {
      var levelMethodName  = utils.getLevelMethodName('load', alias);
      var levelPluginNames = utils.getLevelPluginNames(fakePlugins, alias);

      it('should load 3 packages from ' + alias + ' with regex /^loader.plugin.*/', function () {
        var plugins         = loaderLib[levelMethodName]('loader.plugin.*.' + alias);

        expect(Object.getOwnPropertyNames(plugins)).to.deep.equal(levelPluginNames);
      });
    });

    aliasNames.forEach(function aliasIterator (alias) {
      var levelPluginRegex = 'loader.plugin.*.' + alias;

      it('should load 3 mixins into an Object with regex /' + levelPluginRegex + '/', function () {
        var levelLoadName    = utils.getLevelMethodName('load', alias);
        var levelPluginNames = utils.getLevelPluginNames(fakePlugins, alias);

        var targetObject     = {};
        Object.getOwnPropertyNames(loaderLib[levelLoadName](levelPluginRegex, targetObject));

        var pluginNames = Object.getOwnPropertyNames(targetObject);


        // check returned plugins
        expect(pluginNames).to.deep.equal(levelPluginNames);

        pluginNames.forEach(function pluginIterator (pluginName) {
          var pluginPath = dependencies.getPackagePath(aliases[alias].path, pluginName);

          // check for clear cache
          expect(require.cache[pluginPath]).to.not.equal(undefined);
          expect(targetObject[pluginName]).to.not.equal(undefined);
        });
      });
    });
  });

  describe('provides cache management with', function() {

    describe('"unload" and', function() {

      levelMethods.unload.forEach(function methodIterator (methodName) {
        it('should have a public method "'+methodName+'"', function () {
          loaderLib[methodName].should.be.a('function');
        });
      });

      aliasNames.forEach(function aliasIterator (alias) {
        var levelPluginName = utils.getLevelPluginName('loader.plugin.one', alias);

        it('should remove package "' + levelPluginName + '" from cache in level ' + alias, function () {
          var levelLoadName   = utils.getLevelMethodName('require', alias);
          var levelUnloadName = utils.getLevelMethodName('unload', alias);

          var plugin          = loaderLib[levelLoadName](levelPluginName);

          // check returned plugin
          expect(plugin()).to.equal(levelPluginName);

          // remove plugin from cache
          loaderLib[levelUnloadName](levelPluginName);

          var pluginPath = dependencies.getPackagePath(aliases[alias].path, levelPluginName);

          // check for clear cache
          expect(require.cache[pluginPath]).to.equal(undefined);
        });
      });

      aliasNames.forEach(function aliasIterator (alias) {
        var levelPluginRegex = 'loader.plugin.*.' + alias;

        it('should remove 3 packages from cache in level ' + alias + ' with regex /' + levelPluginRegex + '/', function () {
          var levelLoadName    = utils.getLevelMethodName('load', alias);
          var levelUnloadName  = utils.getLevelMethodName('unload', alias);
          var levelPluginNames = utils.getLevelPluginNames(fakePlugins, alias);

          var pluginNames     = Object.getOwnPropertyNames(loaderLib[levelLoadName](levelPluginRegex));

          // check returned plugins
          expect(pluginNames).to.deep.equal(levelPluginNames);

          // remove plugin from cache
          loaderLib[levelUnloadName](levelPluginRegex);

          pluginNames.forEach(function pluginIterator (pluginName) {
            var pluginPath = dependencies.getPackagePath(aliases[alias].path, pluginName);

            // check for clear cache
            expect(require.cache[pluginPath]).to.equal(undefined);
          });
        });
      });

      aliasNames.forEach(function aliasIterator (alias) {
        var levelPluginRegex = 'loader.plugin.*.' + alias;

        it('should remove 3 mixins from an Object with regex /' + levelPluginRegex + '/', function () {
          var levelLoadName    = utils.getLevelMethodName('load', alias);
          var levelUnloadName  = utils.getLevelMethodName('unload', alias);
          var levelPluginNames = utils.getLevelPluginNames(fakePlugins, alias);

          var targetObject     = {};
          Object.getOwnPropertyNames(loaderLib[levelLoadName](levelPluginRegex, targetObject));

          var pluginNames = Object.getOwnPropertyNames(targetObject);


          // check returned plugins
          expect(pluginNames).to.deep.equal(levelPluginNames);

          // remove plugin from cache
          loaderLib[levelUnloadName](levelPluginRegex, targetObject);

          pluginNames.forEach(function pluginIterator (pluginName) {
            var pluginPath = dependencies.getPackagePath(aliases[alias].path, pluginName);

            // check for clear cache
            expect(require.cache[pluginPath]).to.not.equal(undefined);
            expect(targetObject[pluginName]).to.equal(undefined);
          });
        });
      });
    });
  });

});
