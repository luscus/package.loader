/* jshint node:true */
'use strict';

var expectRequire = require('a').expectRequire,
    Path = require('path'),
    loader;

function mock (packageName, packageExport, level) {
  level.installed.push(packageName);

  var packagePath = level.path +
      Path.sep + 'node_modules' + Path.sep + packageName;

  expectRequire(packagePath).return(packageExport);
}




module.exports = function (_loader) {
  loader = _loader;

  loader.mock = function mockInSelf (packageName, packageExport) {
    return mock(packageName, packageExport, loader.SELF);
  };

  loader.mockInRoot = function mockInRoot (packageName, packageExport) {
    return mock(packageName, packageExport, loader.ROOT);
  };

  return mock;
};
