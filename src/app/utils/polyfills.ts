import util from 'util';

// Add a polyfill that uses Object.assign instead
if (util._extend) {
  util._extend = function(target: any, source: any) {
    console.warn('util._extend is deprecated. Please use Object.assign instead.');
    return Object.assign(target, source);
  };
} 