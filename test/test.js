var plugin = require('../lib/package.module.finder');


console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('dependencies:');
console.log(plugin.dependencies);


console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('Test require("package.root.finder")');

console.log(plugin.require('package.root.finder'));

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('Test match(/^package.*/)');

console.log(plugin.match(/^package.*/));

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('Test load(/^package.*/)');

console.log(plugin.load(/^package.*/));

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('Test loadAll(/^package.*/)');

console.log(plugin.loadAll(/^package.*/));

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('Test match(/^dadadadT.*/)');

console.log(plugin.match(/^dadadadT.*/));

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log('Test match(invalidRegexp)');

console.log(plugin.match('invalidRegexp'));
