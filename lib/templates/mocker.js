/* jshint node:true */
'use strict';

var path         = require('path'),
    mocked       = require('../data/mocked'),
    dependencies = require('../tools/dependencies'),
    hierarchy    = require('../tools/aliases');

function mock (packageName, packageExport, level) {

  var packagePath = dependencies.getPackagePath(level.path, packageName);

  if (!mocked[packagePath]) {
    level.installed.push(packageName);
  }

  mocked[packagePath] = packageExport;
}

function removeMocks () {
  var mockNames = Object.getOwnPropertyNames(mocked);

  Object.getOwnPropertyNames(hierarchy).forEach(function levelIterator (levelName) {
    var level = hierarchy[levelName];

    mockNames.forEach(function mockIterator (mockName) {
      removeMock(mockName, level);
    });
  });
}

function removeMock (packageName, level) {

  if (packageName.indexOf(level.path) > -1) {
    // packageName is the package path: extract packageName
    var pathPrefix = (level.name === 'deploy.folder' ?
                        level.path + path.sep :
                        level.path + path.sep + 'node_modules' + path.sep);

    packageName = packageName.replace(pathPrefix, '');
  }

  var index = level.installed.indexOf(packageName);

  if (index > -1) {
    var packagePath = dependencies.getPackagePath(level.path, packageName);

    level.installed.splice(index, 1);

    delete mocked[packagePath];
    delete require.cache[packagePath];
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
