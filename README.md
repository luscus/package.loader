# [package.module.finder](https://github.com/luscus/package.module.finder)
[![dependencies](https://david-dm.org/luscus/package.module.finder.png)](https://david-dm.org/luscus/package.module.finder)
[![devDependency Status](https://david-dm.org/luscus/package.module.finder/dev-status.svg?theme=shields.io)](https://david-dm.org/luscus/package.module.finder#info=devDependencies)

Searches the npm/bower production dependecies of the root package in order to find modules matching the provided filter.


Take a look to the [TODO](https://github.com/luscus/package.module.finder/blob/master/TODO.md) if you want to help towards the next steps.



## Installation

### Node Dependencies

Execute following line

    npm install package.module.finder@0.1.x --save

### Require module

    var modules = require('package.module.finder');


## Usage

### match(regexp)

Parameters:
- `regexp`: a regular expression

Return an Array with matching module names or an empty Array if no match was found.

    // return a list of dependencies which name starts with 'service'
    modules.match(/^service.*/);

### load(regexp, bowerPath)

Parameters:
- `regexp`: a regular expression
- `bowerPath`: a path relative to the bower module root, pointing to the file to require

Loads one requested plugin, but the regexp has to have a unique match.

Throws an error if too many or no plugin was found.

    // return a list of dependencies which name starts with 'service'
    var myplugin = modules.load(/^service.*/);

### loadAll(regexp, bowerPath)

Parameters:
- `regexp`: a regular expression
- `bowerPath`: a path relative to the bower module root, pointing to the file to require

Loads all matching plugin in a map.

Throws an error if no plugin was found.

    // return a list of dependencies which name starts with 'service'
    var myplugins = modules.loadAll(/^service.*/);

    // access plugin with their names
    myplugins['service-probe'] ...
