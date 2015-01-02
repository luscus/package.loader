/* jshint node:true */
'use strict';

var dependencies = require('../tools/dependencies');


module.exports = function (_loader) {

  _loader.match = function matchInSelf (regexp) {
    return dependencies.matches(regexp, this.SELF);
  };

  _loader.matchInRoot = function matchInRoot (regexp) {
    return dependencies.matches(regexp, this.ROOT);
  };
};
