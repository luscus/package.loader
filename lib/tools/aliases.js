/* jshint node:true */
'use strict';

// force running of crawler to get hierarchy data
require('./crawler');

var hierarchy = require('../data/hierarchy'),
    aliases   = {},
    rootIndex = 0,
    selfIndex = hierarchy.length - 1;

aliases.ROOT = hierarchy[rootIndex];
aliases.SELF = hierarchy[selfIndex];

module.exports = aliases;
