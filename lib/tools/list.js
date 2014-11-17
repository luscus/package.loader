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


module.exports = listDependencies;
