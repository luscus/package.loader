/* jshint node:true */
'use strict';

var Util         = require('util'),
    dependencies = require('../tools/dependencies'),
    mocked       = require('../data/mocked');
var clone        = require('clone');


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


function loadPackages (regexp, level, target, doThrow) {

  if (typeof target === 'boolean' && !doThrow) {
    // fix arguments
    doThrow = target;
    target  = {};
  }

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
  else if (doThrow) {
    throw new Error('no plugin found for regular expression: ' + regexp);
  }
  else {
    return target;
  }
}


function unloadPackages (packageName, level, target) {
  target = target || {};

  if (!Util.isRegExp(packageName)) {
    packageName = '/^' + packageName + '$/';
  }

  // in order to preserve the order,
  // we have to reverse the Array:
  // due to while(index--)
  var matching = dependencies.matches(packageName, level).reverse(),
      idx = matching.length;

  if (idx) {
    while (idx--) {
      var packagePath = dependencies.getPackagePath(level.path, packageName);

      // delete package cache entry
      removePackageFromCache(packagePath);

      // delete Object package property
      delete target[matching[idx]];
    }

    return target;
  }
}


function requirePackage (packageName, level, force) {
  force = force || false;

  if (Util.isRegExp(packageName)) {
    packageName = resolvePackageName(packageName, level);
  }

  var packagePath = dependencies.getPackagePath(level.path, packageName);

  if (force) {
    removePackageFromCache(packagePath);
  }

  if (mocked[packagePath]) {

    if (!require.cache[packagePath]) {
      // add mocked package to require cache
      require.cache[packagePath] = clone(mocked[packagePath]);
    }

    // return mocked package
    return require.cache[packagePath];
  }

  return require(packagePath);
}

function removePackageFromCache (packagePath) {

  if (packagePath) {

    delete require.cache[packagePath];
  }
}


module.exports = function (_loader) {

  _loader.load = function loadFormSelf (regexp, target, doThrow) {
    return loadPackages(regexp, this.SELF, target, doThrow);
  };

  _loader.loadFromRoot = function loadFromRoot (regexp, target, doThrow) {
    return loadPackages(regexp, this.ROOT, target, doThrow);
  };

  _loader.loadFromExternal = function loadFromExternal (regexp, target, doThrow) {
    return loadPackages(regexp, this.EXTERNAL, target, doThrow);
  };

  _loader.unload = function unload (regexp, target) {
    return unloadPackages(regexp, this.SELF, target);
  };

  _loader.unloadFromRoot = function unloadFromRoot (regexp, target) {
    return unloadPackages(regexp, this.ROOT, target);
  };

  _loader.unloadFromExternal = function unloadFromExternal (regexp, target) {
    return unloadPackages(regexp, this.EXTERNAL, target);
  };

  _loader.require = function requireFromSelf (regexp, force) {
    return requirePackage(regexp, this.SELF, force);
  };

  _loader.requireFromRoot = function requireFromRoot (regexp, force) {
    return requirePackage(regexp, this.ROOT, force);
  };

  _loader.requireFromExternal = function requireFromExternal (regexp, force) {
    return requirePackage(regexp, this.EXTERNAL, force);
  };

  return {
    resolvePackageName: resolvePackageName,
    loadPackages: loadPackages,
    unloadPackages: unloadPackages,
    requirePackage: requirePackage,
    removePackageFromCache: removePackageFromCache
  };
};
