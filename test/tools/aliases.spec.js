/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var Path     = require('path'),
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

    it('aliases should have property "EXTERNAL"', function(){
        aliases.should.have.property('EXTERNAL');
        aliases.EXTERNAL.should.be.an('object');

        if (crawler.devMode) aliases.EXTERNAL.name.should.equal('deploy.folder');
    });

  it('aliases should have property "SELF"', function(){
    aliases.should.have.property('ROOT');
    aliases.SELF.should.be.an('object');

    if (crawler.devMode) aliases.SELF.name.should.equal(info.name);
  });

});
