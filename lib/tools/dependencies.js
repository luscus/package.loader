var Path = require('path'),
    FS   = require('fs'),
    finder;

function listDependencies (path) {

  if (path.substring(path.lastIndexOf(Path.sep)) !== 'node_dependencies') {
    throw new Error ('path argument must point to a "node_dependencies" folder.' +
                     '\n - provided: ' + path);
  }

  return FS.readdirSync(path);
}


function filterDependencies (list, filter) {
  return list.filter(function dependencyFilter (package) {
    return (filter[package] ? true : false);
  });
}


module.exports = listDependencies;
module.exports = filterDependencies;
