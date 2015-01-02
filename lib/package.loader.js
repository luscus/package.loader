/* jshint node:true */
'use strict';

var Path      = require('path'),
    Fs        = require('fs'),
    aliases   = require('./tools/aliases'),
    hierarchy = require('./data/hierarchy');

var loader = {};

// discovering/registring package hierarchy
loader.hierarchy = hierarchy;

// expose aliases
loader.ROOT      = aliases.ROOT;
loader.SELF      = aliases.SELF;


// read existing templates
var templateNames = Fs.readdirSync(__dirname + Path.sep + 'templates'),
    template;

templateNames.forEach(function templateNameIterator (templateName) {
  templateName = Path.basename(templateName, '.js');

  // getting template
  template = require(__dirname + Path.sep + 'templates' + Path.sep + templateName);

  // applying template
  template(loader);
});


// exporting API
var properties = Object.getOwnPropertyNames(loader);

properties.forEach(function propertyIterator (property) {

  // exporting only functions
  if (typeof loader[property] === 'function') {
    exports[property] = loader[property];
  }
});

// expose aliases
exports.hierarchy = loader.hierarchy;
exports.ROOT      = loader.ROOT;
exports.SELF      = loader.SELF;
