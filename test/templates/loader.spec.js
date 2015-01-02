/* jshint node:true */
/* jshint expr:true*/
/* global describe */
/* global it */
'use strict';

require('chai').should();

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


describe('Loading:', function() {

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

  it('loadPackages with invalid regular expression', function() {
    loader.loadPackages.should.Throw(Error);
  });

  it('resolvePackageName with invalid regular expression', function() {
    loader.resolvePackageName.should.Throw(Error);
  });

  describe('load package "loader.plugin.one" from SELF - ', function() {
    var packages = loader.loadPackages(/^loader\.plugin\.one$/, loaderLib.SELF),
        packageNames = Object.keys(packages);

    it('only one package returned', function() {
      packageNames.length.should.equal(1);
    });

    it('correct package returned', function() {
      packages.should.have.property('loader.plugin.one');
    });
  });

  describe('load packages "/^loader.plugin.*/" from SELF - ', function() {
    var packages     = loader.loadPackages(/^loader\.plugin.*/, loaderLib.SELF),
        packageNames = Object.keys(packages);

    it('only required packages returned', function() {
      packageNames.should.deep.equal(fakePlugins);
    });

    it('mocked package listed', function() {
      packageNames.indexOf('loader.plugin.one').should.be.above(-1);
    });

  });

});
