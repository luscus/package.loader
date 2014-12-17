// load modules
var Path = require('path'),
    dependencies = require('./dependencies');

// holds the package hierarchy information
var hierarchy = [];


function crawl (isDevMode) {
  'use strict';

  var dirArray = __dirname.split(Path.sep),
      index = dirArray.length,
      level,
      path;

  while (index--) {
    path = dirArray.slice(0, index).join(Path.sep);

    level = inspect(path, isDevMode);

    if (level) {
      hierarchy.unshift(level);
    }
  }


  if (hierarchy.length === 0) {
    // no hierarchy found,
    // only the finder package has been
    // checked out: activating DEV mode
    console.log('activating dev mode');
    hierarchy = crawl(true);
  }

  return hierarchy;
}

function inspect (path, isDevMode) {
  var packageObject,
      level;

  if (dependencies.check(path, isDevMode)) {
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


exports.crawl = crawl;
exports.inspect = inspect;
