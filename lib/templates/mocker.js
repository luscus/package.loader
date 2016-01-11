/* jshint node:true */
'use strict';

var mocked       = require('../data/mocked'),
    dependencies = require('../tools/dependencies'),
    hierarchy    = require('../data/hierarchy');

function mock (packageName, packageExport, level) {
  level.installed.push(packageName);

  var packagePath = dependencies.getPackagePath(level.path, packageName);

  if (!mocked[packagePath]) {
    mocked[packagePath] = packageExport;
  }
}

function removeMocks () {
  var mockNames = Object.getOwnPropertyNames(mocked);

  mockNames.forEach(function mockIterator (mockName) {

    hierarchy.forEach(function levelIterator (level) {
      removeMock(mockName, level);
    });
  });
}

function removeMock (packageName, level) {
  var index = level.installed.indexOf(packageName);

  if (index > -1) {
    var packagePath = dependencies.getPackagePath(level.path, packageName);

    level.installed.splice(index, 1);

    delete mocked[packagePath];
  }
}


function isMocked (packagePath) {
  return (mocked[packagePath] ? true : false);
}



module.exports = function (_loader) {

  _loader.mock = function mockInSelf (packageName, packageExport) {
    return mock(packageName, packageExport, this.SELF);
  };

  _loader.mockInRoot = function mockInRoot (packageName, packageExport) {
    return mock(packageName, packageExport, this.ROOT);
  };

  _loader.mockInExternal = function mockInExternal (packageName, packageExport) {
    return mock(packageName, packageExport, this.EXTERNAL);
  };

  _loader.isMocked = function mocked (packagePath) {
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
