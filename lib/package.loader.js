var Path = require('path'),
    Fs   = require('fs'),
    crawler = require('./tools/crawler');


var finder = {};

// discovering/registring package hierarchy
finder.hierarchy = crawler.crawl();


// read existing templates
var templateNames = Fs.readdirSync(__dirname + Path.sep + 'templates'),
    template;

templateNames.forEach(function templateNameIterator (templateName) {
  templateName = Path.basename(templateName, '.js');

  // getting template
  template = require(__dirname + Path.sep + 'templates' + Path.sep + templateName);

  // applying template
  template(finder);
});


// exporting API
var properties = Object.getOwnPropertyNames(finder);

properties.forEach(function propertyIterator (property) {

  // exporting only functions
  if (typeof finder[property] === 'function') {
    exports[property] = finder[property];
  }
});
