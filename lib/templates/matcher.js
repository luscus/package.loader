var Util = require('util'),
    finder;

function matches (regexp, level) {
  console.log('HERE');
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
      throw new InvalidRegularExpression();
    }
  }
}




module.exports = function (_finder) {
  finder = _finder;

  finder.match = function matchInSelf (regexp) {
    return matches(regexp, finder.aliases.self);
  };

  finder.matchInRoot = function matchInRoot (regexp) {
    return matches(regexp, finder.aliases.root);
  };

  return matches;
};
