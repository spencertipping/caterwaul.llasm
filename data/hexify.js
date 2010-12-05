var s = require('fs').readFileSync('insns.dat', 'ascii');
var hexify = function (n) {return n < 16 ? '0' + n.toString(16) : n.toString(16)};
process.stdout.write(s.replace(/\\x(..)/g,     function (_, n) {return hexify(parseInt(n, 16)) + ' '}).
                       replace(/\\(\d{1,3})/g, function (_, n) {return hexify(parseInt(n, 8)) + ' '}));
