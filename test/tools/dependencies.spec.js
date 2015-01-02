/* jshint node:true */
/* global describe */
/* global it */
'use strict';

require('chai').should();

var Path         = require('path'),
    dependencies = require('../../lib/tools/dependencies'),
    packageInfo  = require('../../package.json'),
    packages     = [].concat(Object.keys(packageInfo.dependencies), Object.keys(packageInfo.devDependencies));

describe('Tool Dependencies -', function(){

  it('list invalid folder', function(){
    dependencies.list.should.Throw(Error);
  });

  it('list own node modules', function(){
    var modulePath = __dirname + Path.sep + '..' + Path.sep + '..' + Path.sep + 'node_modules',
        result     = dependencies.list(modulePath);

    result.should.be.an('array');
    result.should.deep.equal(packages);
  });

  it('filter list', function(){
    var whitelist = ['grunt'],
        result    = dependencies.filter(whitelist, packages);

    result.should.be.an('array');
    result.should.deep.equal(whitelist);
  });

  it('check invalid package folder', function(){
    dependencies.check(__dirname, true).should.equal(false);
  });

  it('check package folder', function(){
    var packagePath = __dirname + Path.sep + '..' + Path.sep + '..';

    dependencies.check(packagePath, true).should.equal(true);
  });

});
