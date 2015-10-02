/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var expect       = require('chai').expect;
var dependencies = require('../../lib/tools/dependencies'),
    crawler      = require('../../lib/tools/crawler'),
    aliases      = require('../../lib/tools/aliases'),
    loader       = require('../../lib/package.loader');

// rerun in dev mode
crawler.crawl(true);


describe('[' + __filename.substring(__filename.indexOf('/test/') + 1) + '] - matcher', function() {

  it('match should be a method', function(){
    loader.match.should.be.a('function');
  });

  it('matchInRoot should be a method', function(){
    loader.matchInRoot.should.be.a('function');
  });

  it('matchInExternal should be a method', function(){
    loader.matchInExternal.should.be.a('function');
  });

  it('find gulp plugins in SELF', function(){
    var plugins = dependencies.matches(/^gulp-.*/, aliases.SELF),
        results = loader.match(/^gulp-.*/),
        error   = false;

    plugins.should.deep.equal(results);

    plugins.forEach(function pluginIterator (pluginName) {
      if (pluginName.indexOf('gulp-') !== 0)
        error = true;
    });

    error.should.equal(false);
  });

  it('find gulp plugins in ROOT', function(){
    var plugins = dependencies.matches(/^gulp-.*/, aliases.ROOT),
        results = loader.matchInRoot(/^gulp-.*/),
        error   = false;

    plugins.should.deep.equal(results);

    plugins.forEach(function pluginIterator (pluginName) {
      if (pluginName.indexOf('gulp-') !== 0)
        error = true;
    });

    error.should.equal(false);
  });

  it('find in external', function(){
    var results = loader.matchInExternal(/^gulp-.*/);

    results.should.deep.equal([]);
  });

  it('match with invalid regular expression', function(){
    dependencies.matches.should.Throw(Error);
  });

});
