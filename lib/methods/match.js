var util = require('util'),
    finder;

function match (regexp, level) {

  if (util.isRegExp(regexp)) {
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




module.exports = function (_finder) {
  finder = _finder;

  finder.matchInParent = function matchInParent (regexp) {
    return match(regexp, finder.parent);
  };

  finder.matchInRoot = function matchInParent (regexp) {
    return match(regexp, finder.root);
  };
}

