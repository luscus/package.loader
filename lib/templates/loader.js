var Util  = require('util'),
    Path = require('path'),
    match,
    finder;


function resolvePackageName (regexp, level) {
  console.log(regexp);
  var matching = match(regexp, level);
  console.log(matching);

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


function loadPackages (regexp, level) {

  // in order to preserve the order,
  // we have to reverse the Array:
  // due to while(index--)
  var matching = match(regexp, level).reverse(),
      idx = matching.length,
      loaded = {};

  if (idx) {
    while (idx--) {
      loaded[matching[idx]] = requireModule(matching[idx], level);
    }

    return loaded;
  }
  else {
    throw new Error('no plugin found for regular expression: ' + regexp);
  }
}


function requirePackage (moduleName, level) {

      if (Util.isRegExp(moduleName)) {
        moduleName = resolvePackageName(moduleName, level);
      }

  return require(level.path + Path.sep + 'node_modules' + Path.sep + moduleName);
}




module.exports = function (_finder) {
  match  = require('./matcher')(_finder);
  finder = _finder;

  finder.load = function loadFormSelf (regexp) {
    return loadPackages(regexp, finder.aliases.self);
  };

  finder.loadFromParent = function loadFromParent (regexp) {
    return loadPackages(regexp, finder.aliases.parent);
  };

  finder.loadFromRoot = function loadFromRoot (regexp) {
    return loadPackages(regexp, finder.aliases.root);
  };

  finder.require = function requireFromSelf (regexp) {
    return requirePackage(regexp, finder.aliases.self);
  };

  finder.requireFromParent = function requireFromParent (regexp) {
    return requirePackage(regexp, finder.aliases.parent);
  };

  finder.requireFromRoot = function requireFromRoot (regexp) {
    return requirePackage(regexp, finder.aliases.root);
  };
};
