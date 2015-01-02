/* jshint node:true */
'use strict';

var mocked        = require('../tools/mocked'),
    dependencies  = require('../tools/dependencies'),
    loader;

function mock (packageName, packageExport, level) {
  level.installed.push(packageName);

  var packagePath = dependencies.getPackagePath(level.path, packageName);

  if (!mocked[packagePath]) {
    mocked[packagePath] = packageExport;
  }
}

function removeMocks () {
}

function removeMock (packageName, level) {
  var index = level.installed.indexOf(packageName);

  if (index > -1) {
    var packagePath = dependencies.getPackagePath(level.path, packageName);

    delete mocked[packagePath];
  }
}


function isMocked (packagePath) {
  return (mocked[packagePath] ? true : false);
}



module.exports = function (_loader) {
  loader = _loader;

  loader.mock = function mockInSelf (packageName, packageExport) {
    return mock(packageName, packageExport, loader.SELF);
  };

  loader.mockInRoot = function mockInRoot (packageName, packageExport) {
    return mock(packageName, packageExport, loader.ROOT);
  };

  loader.isMocked = function mocked (packagePath) {
    return isMocked(packagePath);
  };

  return {
    mocked: mocked,
    mock: mock,
    removeMock: removeMock,
    removeMocks: removeMocks,
    isMocked: isMocked
  };
};
