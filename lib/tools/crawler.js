// load modules
var Path = require('path'),
    dependencies = require('./dependencies'),
    structure = {};

function load () {
  'use strict';

  var dirArray = __dirname.split(Path.sep),
      index = dirArray.length,
      packageObject,
      level,
      path;

  while (index--) {
    path = dirArray.slice(0, index).join(Path.sep);

    level = check(path);

    if (level) {
      structure.unshift(level);
    }
  }


  return structure;
}

function check (path) {
  var packageObject,
      level;

  if (dependencies.check(path)) {
    packageObject = require(path + Path.sep + 'package.json');

    level = {};
    level.name = packageObject.name;
    level.path = path;
    level.installed = dependencies.list(path + Path.sep + 'node_modules');
    level.dependencies = packageObject.dependencies;
    level.devDependencies = packageObject.devDependencies;
  }

  return level;
}


exports.load = load;
exports.check = check;
