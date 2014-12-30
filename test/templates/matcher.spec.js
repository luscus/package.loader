/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var matcher  = require('../../lib/templates/matcher')({}),
    crawler  = require('../../lib/tools/crawler'),
    aliases  = require('../../lib/tools/aliases'),
    loader   = require('../../lib/package.loader');

// rerun in dev mode
crawler.crawl(true);


describe('Matching:', function() {

  it('match should be a method', function(){
    loader.match.should.be.a('function');
  });

  it('matchInRoot should be a method', function(){
    loader.matchInRoot.should.be.a('function');
  });

  it('find grunt plugins in SELF', function(){
    var plugins = matcher(/^grunt-.*/, aliases.SELF),
        results = loader.match(/^grunt-.*/),
        error   = false;

    plugins.should.deep.equal(results);

    plugins.forEach(function pluginIterator (pluginName) {
      if (pluginName.indexOf('grunt-') !== 0)
        error = true;
    });

    error.should.equal(false);
  });

  it('find grunt plugins in ROOT', function(){
    var plugins = matcher(/^grunt-.*/, aliases.ROOT),
        results = loader.matchInRoot(/^grunt-.*/),
        error   = false;

    plugins.should.deep.equal(results);

    plugins.forEach(function pluginIterator (pluginName) {
      if (pluginName.indexOf('grunt-') !== 0)
        error = true;
    });

    error.should.equal(false);
  });

  it('match with invalid regular expression', function(){
    matcher.should.Throw(Error);
  });

});
