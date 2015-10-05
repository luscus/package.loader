/* jshint node:true */
'use strict';

var path         = require('path');
var dependencies = require('./dependencies');

// force running of crawler to get hierarchy data
require('./crawler');

var hierarchy = require('../data/hierarchy'),
    aliases   = {},
    rootIndex = 0,
    selfIndex = hierarchy.length - 1;


aliases.ROOT     = hierarchy[rootIndex];
aliases.SELF     = hierarchy[selfIndex];

var deployPath   = path.normalize(aliases.ROOT.path + path.sep + '..' + path.sep);

aliases.EXTERNAL = {
  name: 'deploy.folder',
  path: deployPath,
  installed: dependencies.list(deployPath)
};

module.exports = aliases;
