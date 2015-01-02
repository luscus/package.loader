/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var loader    = require('../../lib/templates/loader')({}),
    crawler   = require('../../lib/tools/crawler'),
    aliases   = require('../../lib/tools/aliases'),
    mocked    = require('../../lib/data/mocked'),
    loaderLib = require('../../lib/package.loader');




// rerun in dev mode
crawler.crawl(true);

/*
loaderLib.mock('loader.self', function () {
  return 'loader.self called';
});

loaderLib.mockInRoot('loader.root', function () {
  return 'loader.root called';
});
*/

loaderLib.mock('loader.self', function () {
  return 'loader.self called';
});


describe('Matching:', function() {

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

  it('load package "a" from SELF', function() {
    var pack = loader.loadPackages(/^grunt$/, loaderLib.SELF);

    //console.log(pack);
  });

  it('load packages "grunt-" from SELF', function() {
    var pack = loader.loadPackages(/^[alcm].*/, loaderLib.SELF);

     console.log(loaderLib.SELF.installed, Object.keys(pack),mocked);
  });

});
