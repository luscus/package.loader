/* jshint node:true */
'use strict';

var Util = require('util'),
    Path = require('path'),
    Fs   = require('fs'),
    self = require(__dirname + '/../../package.json');

function list (path) {

  if (path.substring(path.lastIndexOf(Path.sep) + 1) !== 'node_modules') {
    throw new Error ('path argument must point to a "node_modules" folder.' +
                     ' provided: ' + path);
  }

  var folders = Fs.readdirSync(path);

  folders.forEach(function folderIterator (folderName, index) {
    if (folderName.match(/^\..*/)) {
      folders.splice(index, 1);
    }
  });

  // package folder names as Array
  return folders;
}


function filter (whitelist, packages) {

  return whitelist.filter(function dependencyFilter (packageName) {

    // if the installed package defined in the package.json?
    return (packages.indexOf(packageName) < 0 ? false : true);
  });
}


function check (path, isDevMode) {
  var status = false,
      info;

  try {
    // try to load package.json
    info = require(path + Path.sep + 'package.json');
    // filtering out the finder package
    // unless package is in DEV mode
    if (info.name !== self.name || isDevMode) {
      status = true;
    }
  }
  catch (ex) {
    // no package.json found
    status = false;
  }

  return status;
}


function matches (regexp, level) {
  if (level) {
    if (Util.isRegExp(regexp)) {
      var matching = [],
          idx = level.installed.length;

      while (idx--) {
        if (regexp.test(level.installed[idx])) {
          matching.push(level.installed[idx]);
        }
      }

      // in order to preserve the order,
      // we have to reverse the Array:
      // due to while(index--)
      return matching.reverse();
    }
    else {
      throw new Error('Invalid regular expression');
    }
  }
  else {
    throw new Error('Provide a hierarchy level');
  }
}

function getPackagePath (root, packageName) {
  return Path.normalize(root + Path.sep + 'node_modules' + Path.sep + packageName);
}

function getPackageMain (root, packageName) {
  return getPackagePath(root, packageName)  + Path.sep + 'index.js';
}


exports.list           = list;
exports.check          = check;
exports.filter         = filter;
exports.matches        = matches;
exports.getPackagePath = getPackagePath;
exports.getPackageMain = getPackageMain;
