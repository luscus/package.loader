/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var should       = require('chai').should(),
    Path         = require('path'),
    crawler      = require('../../lib/tools/crawler'),
    packageInfo  = require('../../package.json');

// rerun in dev mode
crawler.crawl(true);

describe('Tool Crawler -', function(){

  it('inspect invalid folder', function(){
    should.not.exist(crawler.inspect(__dirname));
  });


  var packagePath = __dirname + Path.sep + '..' + Path.sep + '..',
      inspected   = crawler.inspect(packagePath);

  it('inspect own package folder', function(){
    inspected.should.be.an('object');
  });

  it('packagePath has name property', function(){
    inspected.should.have.property('name', packageInfo.name);
  });

  it('packagePath has path property', function(){
    inspected.should.have.property('path', Path.normalize(packagePath));
  });

  it('packagePath has main property', function(){
    inspected.should.have.property('main');
  });

  it('packagePath has dependencies property', function(){
    inspected.should.have.property('dependencies');
    inspected.dependencies.should.be.an('object');
    inspected.dependencies.should.deep.equal(packageInfo.dependencies);
  });

  it('packagePath has devDependencies property', function(){
    inspected.should.have.property('devDependencies');
    inspected.devDependencies.should.be.an('object');
    inspected.devDependencies.should.deep.equal(packageInfo.devDependencies);
  });

  it('packagePath has installed property', function(){
    inspected.should.have.property('installed');
    inspected.installed.should.be.an('array');
  });

});
