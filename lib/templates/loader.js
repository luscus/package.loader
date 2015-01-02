/* jshint node:true */
'use strict';

var Util         = require('util'),
    dependencies = require('../tools/dependencies'),
    mocked       = require('../data/mocked');


function resolvePackageName (regexp, level) {
  var matching = dependencies.matches(regexp, level);

  if (matching.length === 1) {
    return matching[0];
  }
  else if (matching.length === 0) {
    throw new Error('no plugin found for regular expression: ' + regexp);
  }
  else {
    throw new Error('too many plugins found for regular expression: ' + regexp);
  }
}


function loadPackages (regexp, level, target) {
  target = target || {};

  // in order to preserve the order,
  // we have to reverse the Array:
  // due to while(index--)
  var matching = dependencies.matches(regexp, level).reverse(),
      idx = matching.length;

  if (idx) {
    while (idx--) {
      target[matching[idx]] = requirePackage(matching[idx], level);
    }

    return target;
  }
  else {
    throw new Error('no plugin found for regular expression: ' + regexp);
  }
}


function requirePackage (packageName, level) {

  if (Util.isRegExp(packageName)) {
    packageName = resolvePackageName(packageName, level);
  }

  var packagePath = dependencies.getPackagePath(level.path, packageName);

  if (mocked[packagePath]) {
    // mocked package: call for main file
    return mocked[packagePath];
  }

  return require(packagePath);
}




module.exports = function (_loader) {

  _loader.load = function loadFormSelf (regexp, target) {
    return loadPackages(regexp, this.SELF, target);
  };

  _loader.loadFromRoot = function loadFromRoot (regexp, target) {
    return loadPackages(regexp, this.ROOT, target);
  };

  _loader.require = function requireFromSelf (regexp) {
    return requirePackage(regexp, this.SELF);
  };

  _loader.requireFromRoot = function requireFromRoot (regexp) {
    return requirePackage(regexp, this.ROOT);
  };

  return {
    resolvePackageName: resolvePackageName,
    loadPackages: loadPackages,
    requirePackage: requirePackage
  };
};
