// Numerical macro tests.

caterwaul.clone('std seq llasm.numerics')(function () {
  var eight = b00001000;
  eight.length === 1 || null['b00001000.length should not be #{eight.length}'];
  eight[0]     === 8 || null['b00001000[0] should not be #{eight[0]}'];

  x40.length === 1 || null['x40.length should not be #{x40.length}'];
  x40[0] === 64 || null['x40[0] should not be #{x40[0]}'];
})();

// Generated by SDoc 
