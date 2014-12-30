/* jshint node:true */
'use strict';

var crawler   = require('./crawler'),
    aliases   = {},
    rootIndex = 0,
    selfIndex = crawler.hierarchy.length - 1;

aliases.ROOT = crawler.hierarchy[rootIndex];
aliases.SELF = crawler.hierarchy[selfIndex];

module.exports = aliases;
