
var Path = require('path'),
    Fs   = require('fs');

function list (path) {
  "use strict";

  if (path.substring(path.lastIndexOf(Path.sep)) !== 'node_dependencies') {
    throw new Error ('path argument must point to a "node_dependencies" folder.' +
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


function check (path) {
  "use strict";

  var status = false;

  try {
    // try to load package.json
    require(path + '/package.json');
    status = true;
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
