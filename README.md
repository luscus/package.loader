# package.loader

[![NPM version](https://img.shields.io/npm/v/package.loader.svg?style=flat)](https://www.npmjs.com/package/package.loader "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/package.loader.svg?style=flat)](https://www.npmjs.com/package/package.loader "View this project on NPM")
[![NPM license](https://img.shields.io/npm/l/package.loader.svg?style=flat)](https://www.npmjs.com/package/package.loader "View this project on NPM")
[![flattr](https://img.shields.io/badge/flattr-donate-yellow.svg?style=flat)](http://flattr.com/thing/3817419/luscus-on-GitHub)

![coverage](https://rawgit.com/luscus/package.loader/master/reports/coverage.svg)
[![David](https://img.shields.io/david/luscus/package.loader.svg?style=flat)](https://david-dm.org/luscus/package.loader)
[![David](https://img.shields.io/david/dev/luscus/package.loader.svg?style=flat)](https://david-dm.org/luscus/package.loader#info=devDependencies)

Search/loads/mocks dependencies from three specific locations EXTERNAL, ROOT or SELF. Enables to create a plugin system for apps.

- `SELF`: some library, the package which has `package.loader` as dependency
- `ROOT`: some application, the first package in the package hierarchy
- `EXTERNAL`: the deploy folder of the `ROOT` package

<pre>
 EXTERNAL (deploy folder)
  |
  |_ app-1
  |_ ROOT (app-2)
      |_ node_modules
            |
            |_ ROOT.dependency.1
            |_ ROOT.dependency.2
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
            |    |_ package.dependency.1
            |    |_ package.dependency.2
            |
            |_ ROOT.dependency.3
            |_ ROOT.dependency.4
</pre>

`SELF` and `ROOT` may be the same packages.

Each provided method is to be found in three flavors (except mocking): directed towards `SELF`, `ROOT` or `EXTERNAL`.

This library can be used to implement support for a plugin system based on package names conventions.



## Installation

### Node Dependencies

Execute following line

    npm install package.loader --save

### Require module

    var loader = require('package.loader');


## Usage

### match, matchInRoot, matchInExternal

Parameters:
- `regexp`: a regular expression

Return an Array with matching package names or an empty Array if no match was found.

    // return a list of dependencies which name starts with 'service'
    loader.match(/^service.*/);

### require, requireFromRoot, requireFromExternal

Parameters:
- `package`: a regular expression or a string
- `force`: boolean, disabling cache and force the loading of the wanted package

Loads one requested plugin, but the regexp has to have an unique match.

Throws an error if too many or no plugin was found.

    loader.require('mypackage');
    loader.require('../tools/mytool');
    loader.require(/^service.*/);

    // force reload mytool
    loader.require('../tools/mytool', true);

### load, loadFromRoot, loadFromExternal

Parameters:
- `regexp`: a regular expression
- `target`: an object in which the package will be loaded into. Package will be available under <Object>.<package_name>
- `doThrow`: boolean, if no package was found and throwing is enabled an error will be raised

Loads one requested plugin, but the regexp has to have a at least one match.

Throws an error if no plugin was found.

    // return a list of dependencies which name starts with 'service'
    var myplugin = loader.load(/^service.*/);

### unload, unloadFromRoot, unloadFromExternal

Parameters:
- `package`: a regular expression or a string

Loads one requested plugin, but the regexp has to have a at least one match.

Throws an error if no plugin was found.

    // return a list of dependencies which name starts with 'service'
    var myplugin = loader.load(/^service.*/);

### mock, mockInRoot, mockInExternal

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
Copyright (c) 2014-2016 Luscus (luscus.redbeard@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
