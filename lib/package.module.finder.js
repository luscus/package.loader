/*
    Copyright (C) 2013  Luscus
    <https://github.com/luscus/package.module.finder>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program: see COPYING in the root directory.
    If not, see <http://www.gnu.org/licenses/>.
*/

// load modules
var rootPackage = require('package.root.finder'),
    dependencies = {},
    registeredDependencies,
    path = require('path');


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

  if (regexp.test) {
    var matching = [],
        idx = registeredDependencies.length;

    while (idx--) {
      if (regexp.test(registeredDependencies[idx])) {
        matching.push(registeredDependencies[idx]);
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
      return require(moduleName);
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
  list.reverse()

  var index = list.length,
      dependency;

  while (index--) {
    dependency = list[index];

    dependencies[dependency] = {
      type: type,
      category: category
    }
  }
}


module.exports = {
  dependencies: dependencies,
  match: function (regexp) {
    return match(regexp);
  },
  load: function (regexp) {
    return load(regexp);
  },
  loadAll: function (regexp) {
    return loadAll(regexp);
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
