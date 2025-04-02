const util = require('util');

// Intentionally use the deprecated method to see the stack trace
util._extend({}, {});

console.log('Deprecation check complete'); 