function aliases (finder) {

  if (finder.hierarchy) {
    var rootIndex = 0,
        selfIndex = finder.hierarchy.length - 1,
        parentIndex = (selfIndex === 0 ? 0 : selfIndex - 1);

    finder.aliases = {};

    finder.aliases.root = finder.hierarchy[rootIndex];
    finder.aliases.self = finder.hierarchy[selfIndex];
    finder.aliases.parent = finder.hierarchy[parentIndex];
  }
}


module.exports = aliases;
