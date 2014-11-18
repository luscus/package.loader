var rootPackage = require('package.root.finder'),
    expectRequire = require('a').expectRequire,
    path = require('path'),
    util = require('util'),
    fs   = require('fs'),
    crawler = require('./tools/crawler'),
    match = require('./methods/match'),
    dependencies = {},
    installedPackages = fs.readdirSync(rootPackage.path + path.sep + 'node_modules'),
    registeredDependencies;



var structure = crawler.load(),
    finder = {};

finder.hierarchy = structure;

finder.parent = finder.hierarchy[(finder.hierarchy.length -1 )];
finder.root = finder.hierarchy[0];

match(finder);
console.log('finder: ', finder.matchInParent(/^grunt\-*/));

// register dependencies
addDependencies(Object.keys(rootPackage.package.dependencies), 'npm', 'production');

// only dependencies allowed at the time.
// TODO check necessity for other dependencies
//addDependencies(Object.keys(rootPackage.package.devDependencies), 'npm', 'development');
//addDependencies(Object.keys(rootPackage.package.optionalDependencies), 'npm', 'optional');
//addDependencies(Object.keys(rootPackage.package.peerDependencies), 'npm', 'peer');

if (rootPackage.bower) {
  addDependencies(Object.keys(rootPackage.bower.dependencies), 'bower', 'production');
}


// Store all found dependencies as Array of names
registeredDependencies = Object.keys(dependencies);


function match (regexp) {

  if (util.isRegExp(regexp)) {
    var matching = [],
        idx = installedPackages.length;

    while (idx--) {
      if (regexp.test(installedPackages[idx])) {
        matching.push(installedPackages[idx]);
      }
    }

    // in order to preserve the order,
    // we have to reverse the Array:
    // due to while(index--)
    return matching.reverse();
  }
  else {
    throw new InvalidRegularExpression();
  }
}


function load (regexp, bowerPath) {
  var matching = match(regexp);

  if (matching.length === 1) {
    return requireModule(matching[0], bowerPath);
  }
  else if (matching.length === 0) {
    throw new NoModuleFoundException(regexp);
  }
  else {
    throw new TooManyModulesException();
  }
}


function loadAll (regexp, bowerPath) {

  // in order to preserve the order,
  // we have to reverse the Array:
  // due to while(index--)
  var matching = match(regexp).reverse(),
      idx = matching.length,
      loaded = {};

  if (matching.length) {
    while (idx--) {
      loaded[matching[idx]] = requireModule(matching[idx], bowerPath);
    }

    return loaded;
  }
  else {
    throw new NoModuleFoundException(regexp);
  }
}


function requireModule (moduleName, bowerPath) {

  if (dependencies[moduleName]) {

    if (dependencies[moduleName].type === 'npm') {

      // Module is a NPM package
      //console.log('Load npm package: ', moduleName);
      return rootPackage.require(moduleName);
    }
    else {

      // Module is a bower package
      //console.log('Load bower package: ', rootPackage.path + path.sep + rootPackage.bower.directory + path.sep + moduleName + path.sep + bowerPath);
      return require(rootPackage.path + path.sep + rootPackage.bower.directory + path.sep + moduleName + path.sep + bowerPath);
    }
  }
}


function addDependencies (list, type, category) {

  // in order to preserve the order,
  // we have to reverse the Array:
  // due to while(index--)
  list.reverse();

  var index = list.length,
      dependency;

  while (index--) {
    dependency = list[index];

    dependencies[dependency] = {
      type: type,
      category: category
    };
  }
}

function mock (packageName, packageExport) {
  installedPackages.push(packageName);

  var packagePath = rootPackage.path +
      path.sep + 'node_modules' + path.sep + packageName;

  expectRequire(packagePath).return(packageExport);
}

module.exports = {
  dependencies: dependencies,
  packages: installedPackages,
  require: function (moduleName) {
    return rootPackage.require(moduleName);
  },
  match: function (regexp) {
    return match(regexp);
  },
  load: function (regexp) {
    return load(regexp);
  },
  loadAll: function (regexp) {
    return loadAll(regexp);
  },
  mock: function (packageName, packageExport) {
    mock(packageName, packageExport);
  }
};



function InvalidRegularExpression () {
  this.message = new Error('you have to provide a valid regular expression');
  this.name = 'InvalidRegularExpression';
}

function NoModuleFoundException (regexp) {
  this.message = new Error('no plugin found matching the provided regular expression: "'+regexp+'"');
  this.name = 'NoModuleFoundException';
}

function TooManyModulesException () {
  this.message = new Error('your regular expression returned too many plugins, be more specific');
  this.name = 'TooManyModulesException';
}
