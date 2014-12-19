/* jshint node:true */
'use strict';

var Path = require('path'),
    Fs   = require('fs'),
    self = require(__dirname + '/../../package.json');

function list (path) {

  if (path.substring(path.lastIndexOf(Path.sep) + 1) !== 'node_modules') {
    throw new Error ('path argument must point to a "node_modules" folder.' +
                     ' provided: ' + path);
  }

  var folders = Fs.readdirSync(path);

  folders.forEach(function folderIterator (folderName, index) {
    if (folderName.match(/\..*/)) {
      folders.splice(index, 1);
    }
  });

  // package folder names as Array
  return folders;
}


function filter (whitelist, packages) {

  return whitelist.filter(function dependencyFilter (packageName) {

    // if the installed package defined in the package.json?
    return (packages.indexOf(packageName) > -1 ? true : false);
  });
}


function check (path, isDevMode) {
  var status = false,
      info;
  console.log(path + Path.sep + 'package.json');

  try {
    // try to load package.json
    info = require(path + Path.sep + 'package.json');
    // filtering out the finder package
    // unless package is in DEV mode
    console.log(info.name, self.name, isDevMode);
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


exports.list = list;
exports.check = check;
exports.filter = filter;
