# [package.loader](https://github.com/luscus/package.loader)

[![NPM](https://nodei.co/npm/package.loader.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/package.loader/)

[![NPM version](https://img.shields.io/npm/v/package.loader.svg?style=flat)](https://www.npmjs.com/package/package.loader "View this project on NPM")
[![David](https://img.shields.io/david/luscus/package.loader.svg?style=flat)](https://david-dm.org/luscus/package.loader)
[![David](https://img.shields.io/david/dev/luscus/package.loader.svg?style=flat)](https://david-dm.org/luscus/package.loader#info=devDependencies)
[![NPM license](https://img.shields.io/npm/l/package.loader.svg?style=flat)](https://www.npmjs.com/package/package.loader "View this project on NPM")
[![Omniref](https://img.shields.io/badge/Omniref-docs-orange.svg?style=flat)](https://www.omniref.com/js/npm/package.loader)
[![flattr](https://img.shields.io/badge/flattr-donate-yellow.svg?style=flat)](http://flattr.com/thing/3817419/luscus-on-GitHub)

Search/loads dependencies from the ROOT or SELF packages:

- `SELF`: the package which has `package.loader` as dependency
- `ROOT`: the first package in the package hierarchy

<pre>
    ROOT
      |_ node_modules
            |
            |_ PACKAGE_X
            |  |_ node_modules
            |    |
            |    |_ SELF
            |    |  |_ node_modules
            |    |    |
            |    |    |_ package.loader
            |    |    |_ SELF.dependency.1
            |    |    |_ SELF.dependency.2
            |    |    |_ SELF.dependency.3
            |    |
            |    |_ PACKAGE_X.dependency.1
            |    |_ PACKAGE_X.dependency.2
            |
            |_ ROOT.dependency.1
            |_ ROOT.dependency.2
            |_ ROOT.dependency.3
</pre>

`SELF` and `ROOT` may be the same packages.

Each provided method is to be found in two flavors: directed towards `SELF` or `ROOT`.

This library can be used to implement support for a plugin system based on package names conventions.



## Installation

### Node Dependencies

Execute following line

    npm install package.loader --save

### Require module

    var loader = require('package.loader');


## Usage

### match, matchInRoot

Parameters:
- `regexp`: a regular expression

Return an Array with matching package names or an empty Array if no match was found.

    // return a list of dependencies which name starts with 'service'
    loader.match(/^service.*/);

### require, requireFromRoot

Parameters:
- `package`: a regular expression or a string

Loads one requested plugin, but the regexp has to have an unique match.

Throws an error if too many or no plugin was found.

    loader.require('mypackage');
    loader.require('../tools/mytool');
    loader.require(/^service.*/);

### load, loadFromRoot

Parameters:
- `regexp`: a regular expression

Loads one requested plugin, but the regexp has to have a at least one match.

Throws an error if no plugin was found.

    // return a list of dependencies which name starts with 'service'
    var myplugin = loader.load(/^service.*/);

### mock, mockInRoot

Parameters:
- `packageName`: a package name
- `packageExport`: the Object to be returned by the mocked package

Enables to mock packages in the dependencies from SELF or ROOT.
This can be used for testing.

    // define a mock in SELF
    loader.mock('hello.world', function () {console.log('hello world')});

    // access mock
    var mock = loader.require('hello.world')

    mock(); // prints "hello world"



-------------------
Copyright (c) 2014 Luscus (luscus.redbeard@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
