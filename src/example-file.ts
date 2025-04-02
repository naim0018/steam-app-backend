import util from 'util';

// Before
// const mergedObject = util._extend(targetObject, sourceObject);

// After
const mergedObject = Object.assign({}, targetObject, sourceObject);

// Or using spread operator (even better)
const mergedObject = { ...targetObject, ...sourceObject }; 