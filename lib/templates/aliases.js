/* jshint node:true */
'use strict';

function aliases (finder) {

  if (finder.hierarchy) {
    var rootIndex = 0,
        selfIndex = finder.hierarchy.length - 1;

    finder.aliases = {};

    finder.aliases.root = finder.hierarchy[rootIndex];
    finder.aliases.self = finder.hierarchy[selfIndex];
  }
}


module.exports = aliases;
