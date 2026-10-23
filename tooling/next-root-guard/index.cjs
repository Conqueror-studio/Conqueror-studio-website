'use strict';

// Only the default Next project root is supported. Never silently skip lint rules.
function rejectGlob() {
  const error = new Error('CONQUEROR_GLOB_UNSUPPORTED: custom Next roots require security review');
  error.code = 'CONQUEROR_GLOB_UNSUPPORTED';
  throw error;
}

module.exports = Object.freeze({ globSync: rejectGlob, sync: rejectGlob });
