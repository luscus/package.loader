/* jshint node:true */
'use strict';

var crawler   = require('./crawler'),
    aliases   = {},
    rootIndex = 0,
    selfIndex = crawler.hierarchy.length - 1;

aliases.root = crawler.hierarchy[rootIndex];
aliases.self = crawler.hierarchy[selfIndex];

exports.aliases = aliases;
