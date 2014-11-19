var expectRequire = require('a').expectRequire,
    Util = require('util'),
    Path = require('path'),
    finder;

function mock (packageName, packageExport, level) {
  level.installed.push(packageName);

  var packagePath = level.path +
      Path.sep + 'node_modules' + Path.sep + packageName;

  expectRequire(packagePath).return(packageExport);
}




module.exports = function (_finder) {
  finder = _finder;

  finder.mock = function mockInSelf (packageName, packageExport) {
    return mock(packageName, packageExport, finder.aliases.self);
  };

  finder.mockInParent = function mockInParent (packageName, packageExport) {
    return mock(packageName, packageExport, finder.aliases.parent);
  };

  finder.mockInRoot = function mockInRoot (packageName, packageExport) {
    return mock(packageName, packageExport, finder.aliases.root);
  };

  return mock;
};
