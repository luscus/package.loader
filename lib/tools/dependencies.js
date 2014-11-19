
var Path = require('path'),
    Fs   = require('fs'),
    self = require(__dirname + '/../../package.json');

function list (path) {
  "use strict";

  if (path.substring(path.lastIndexOf(Path.sep) + 1) !== 'node_modules') {
    throw new Error ('path argument must point to a "node_modules" folder.' +
                     '\n - provided: ' + path);
  }

  // package folder names as Array
  return Fs.readdirSync(path);
}


function filter (list, definedDependencies) {
  "use strict";

  return list.filter(function dependencyFilter (packageName) {

    // if the installed package defined in the package.json?
    return (definedDependencies[packageName] ? true : false);
  });
}


function check (path, isDevMode) {
  "use strict";

  var status = false,
      info;

  try {
    // try to load package.json
    info = require(path + '/package.json');

    // filtering out the finder package
    // unless package is in DEV mode
    if (info.name !== self.name || isDevMode) {
      status = true;
    }
  }
  catch (ex) {
    // no package.json found
    //console.log('  --> no package.json found in', path);
  }


  return status;
}


exports.list = list;
exports.check = check;
exports.filter = filter;
