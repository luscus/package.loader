# package.loader

[![NPM version](https://badge.fury.io/js/package.loader.svg)](http://badge.fury.io/js/package.loader)
[![dependencies](https://david-dm.org/luscus/package.loader.svg)](https://david-dm.org/luscus/package.loader)
[![devDependency Status](https://david-dm.org/luscus/package.loader/dev-status.svg?theme=shields.io)](https://david-dm.org/luscus/package.loader#info=devDependencies)

Search/loads dependencies from the ROOT, PARENT or SELF packages:

- `SELF`: the package with has `package.loader` as dependency
- `PARENT`: the parent package to `SELF`
- `ROOT`: the first package in the package hierarchy

<pre>
    ROOT
      |_ node_modules
            |
            |_ PARENT
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
            |    |_ PARENT.dependency.1
            |    |_ PARENT.dependency.1
            |
            |_ ROOT.dependency.1
            |_ ROOT.dependency.2
            |_ ROOT.dependency.3
</pre>

`PARENT` and `ROOT` may be the same packages.

Each provided method is to be found in three flavors: derected towards `SELF`, `PARENT` or `ROOT`.

This library can be used to implement support for a plugin system based on package names conventions.



## Installation

### Node Dependencies

Execute following line

    npm install package.loader --save

### Require module

    var loader = require('package.loader');


## Usage

### match, matchInParent, matchInRoot

Parameters:
- `regexp`: a regular expression

Return an Array with matching package names or an empty Array if no match was found.

    // return a list of dependencies which name starts with 'service'
    loader.match(/^service.*/);

### require, requireFromParent, requireFromRoot

Parameters:
- `package`: a regular expression or a string

Loads one requested plugin, but the regexp has to have an unique match.

Throws an error if too many or no plugin was found.

    loader.require('mypackage');
    loader.require('../tools/mytool');
    loader.require(/^service.*/);

### load, loadFromParent, loadFromRoot

Parameters:
- `regexp`: a regular expression

Loads one requested plugin, but the regexp has to have a at least one match.

Throws an error if no plugin was found.

    // return a list of dependencies which name starts with 'service'
    var myplugin = loader.load(/^service.*/);

### mock, mockInParent, mockInRoot

Parameters:
- `packageName`: a package name
- `packageExport`: the Object to be returned by the mocked package

Enables to mock packages in the dependencies from SELF, PARENT or ROOT.
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
