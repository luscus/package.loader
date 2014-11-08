# package.module.finder

[![NPM version](https://badge.fury.io/js/package.module.finder.svg)](http://badge.fury.io/js/package.module.finder)
[![dependencies](https://david-dm.org/luscus/package.module.finder.svg)](https://david-dm.org/luscus/package.module.finder)
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

### require(packageName)

Parameters:
- `packageName`: a String matching the package name or a relative path to some file. The path is relative to the *node_modules* directory.

Returns a package.

    modules.require('mypackage');
    modules.require('../folder/someFile');
    modules.require('../package.json');

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



-------------------
Copyright (c) 2014 Luscus (luscus.redbeard@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

Except as contained in this notice, the name(s) of the above copyright holders shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
