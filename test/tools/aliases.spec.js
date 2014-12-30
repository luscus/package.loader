/* jshint node:true */
/* global describe */
/* global it */
'use strict';

var Path     = require('path'),
    should   = require('chai').should(),
    info     = require('../../package.json'),
    crawler  = require('../../lib/tools/crawler'),
    aliases  = require('../../lib/tools/aliases');

// rerun in dev mode
crawler.crawl(true);


describe('Aliases:', function(){

  it('aliases should have property "ROOT"', function(){
    aliases.should.have.property('ROOT');
    aliases.ROOT.should.be.an('object');

    if (crawler.devMode) aliases.ROOT.name.should.equal(info.name);
  });

  it('aliases should have property "SELF"', function(){
    aliases.should.have.property('ROOT');
    aliases.SELF.should.be.an('object');

    if (crawler.devMode) aliases.SELF.name.should.equal(info.name);
  });

});
