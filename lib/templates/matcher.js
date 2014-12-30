/* jshint node:true */
'use strict';

var Util = require('util'),
    loader;

function matches (regexp, level) {
  if (level) {
    if (Util.isRegExp(regexp)) {
      var matching = [],
          idx = level.installed.length;

      while (idx--) {
        if (regexp.test(level.installed[idx])) {
          matching.push(level.installed[idx]);
        }
      }

      // in order to preserve the order,
      // we have to reverse the Array:
      // due to while(index--)
      return matching.reverse();
    }
    else {
      throw new Error('Invalid regular expression');
    }
  }
}




module.exports = function (_loader) {
  loader = _loader;

  loader.match = function matchInSelf (regexp) {
    return matches(regexp, loader.SELF);
  };

  loader.matchInRoot = function matchInRoot (regexp) {
    return matches(regexp, loader.ROOT);
  };

  return matches;
};
