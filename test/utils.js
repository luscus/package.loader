/* jshint node:true */
'use strict';


var camelize  = require('camelize');
var mocker    = require('../lib/templates/mocker')({});

exports.getLevelMethodName = function getLevelMethodName (methodName, alias) {
  if (alias === 'SELF') {
    return methodName;
  }
  else {
    return camelize(methodName + 'From_' + alias.toLowerCase());
  }
};

exports.getLevelMethods = function getLevelMethods (methods, aliases) {
  var aliasNames   = Object.getOwnPropertyNames(aliases);
  var levelMethods = {};

  methods.forEach(function methodIterator (methodName) {
    levelMethods[methodName] = [];

    aliasNames.forEach(function aliasIterator (alias) {
      levelMethods[methodName].push(exports.getLevelMethodName(methodName, alias));
    });

    levelMethods[methodName].sort();
  });

  return levelMethods;
};

exports.getLevelPluginName = function getLevelPluginName (pluginName, alias) {
  return pluginName + '.' + alias;
};

exports.getLevelPluginNames = function getLevelPluginNames (pluginNames, alias) {
  var levelPluginNames = [];

  pluginNames.forEach(function pluginIterator(pluginName) {
    levelPluginNames.push(exports.getLevelPluginName(pluginName, alias));
  });

  return levelPluginNames.sort();
};

exports.mockInAllLevels = function mockInAllLevels (pluginNames, aliases, pluginExport) {
  var aliasNames   = Object.getOwnPropertyNames(aliases);

  aliasNames.sort().forEach(function aliasIterator (alias) {
    var levelPluginNames = exports.getLevelPluginNames(pluginNames, alias);

    levelPluginNames.forEach(function pluginIterator(pluginName) {
      var levelPluginExport = pluginExport || function () {
          return pluginName;
        };

      mocker.mock(pluginName, levelPluginExport, aliases[alias]);
    });
  });
};
