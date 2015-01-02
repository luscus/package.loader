/* jshint node:true */
'use strict';

// load modules
var Path         = require('path'),
    dependencies = require('./dependencies'),
    hierarchy    = require('../data/hierarchy');

// holds the package hierarchy information
var devMode   = false;


function crawl (isDevMode) {
  devMode = isDevMode || devMode;

  // reset hierarchy
  hierarchy.splice(0);

  var dirArray = __dirname.split(Path.sep),
      index = dirArray.length,
      level,
      path;

  while (index--) {
    path = dirArray.slice(0, index).join(Path.sep);

    level = inspect(path, devMode);

    if (level) {
      hierarchy.unshift(level);
    }
  }


  if (hierarchy.length === 0) {
    // no hierarchy found,
    // only the finder package has been
    // checked out: activating DEV mode and retry
    console.log('activating dev mode');
    devMode   = true;
    crawl();
  }

  return hierarchy;
}

function inspect (path) {
  var packageObject,
      level;

  if (dependencies.check(path, devMode)) {
    packageObject = require(path + Path.sep + 'package.json');

    level = {};
    level.name = packageObject.name;
    level.path = Path.normalize(path);

    if (packageObject.main) {
      level.main = Path.normalize(level.path + Path.sep + packageObject.main);
    }
    else {
      level.main = level.path + Path.sep + 'index.js';
    }

    level.installed = dependencies.list(path + Path.sep + 'node_modules');
    level.dependencies = packageObject.dependencies;
    level.devDependencies = packageObject.devDependencies;
  }

  return level;
}


crawl();

exports.devMode   = devMode;
exports.crawl     = crawl;
exports.inspect   = inspect;
