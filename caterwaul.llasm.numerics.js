// Numerical macros | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// Javascript's numerical facilities are quite good, but there are some situations for which the notation is suboptimal. In particular, Javascript doensn't have great support for low-level bit
// flipping or preserving the byte-size of an integer. This library solves these problems.

// Notation.
// You can specify numbers in either hex or binary by prefixing an even number of hex or binary digits by an 'x' or 'b', respectively. (For binary you actually need a multiple of eight digits.)
// The bit width is encoded with these numbers, as well as little-endian vs. big-endian encoding (by default big-endian encoding is used).

// | x08048000             // [0x08, 0x04, 0x80, 0x00]
//   b00100100             // [0x24]
//   xl08048000            // [0x00, 0x80, 0x04, 0x08]
//   xl_0804_80_00         // ditto
//   xaef0                 // [0xae, 0xf0]

// For convenience you can put underscores in the numbers; they get ignored but can visually separate things.

// Note that this module requires strings to be numerically indexable, as they are in most places except for IE.

  caterwaul.tconfiguration('std seq', 'llasm.numerics', function () {
    this.configure('std llasm.struct').macro(qs[_], fn[x][x && /^[bx]l?[0-9a-f_]{2,}$/.test(x.data) && x.data.replace(/^[xb]l?/, '').replace(/_/g, '') /re[
                                                            seq[0 >>>[_ + lm] <<n[n < _.length]] /re.ns[seq[ns *i[_.substring(i, i + lm)] *~[~_ *+d /[_ << shift | _0]]]]
                                                                                                    /re[le ? _.reversed() : _] /re[new this.ref(_)], unless[_.length & lm - 1],
                                                            where*[d(x) = '0123456789abcdef'.indexOf(x), ca = x.data/mb/charAt, h = ca(0) === 'x', le = ca(1) === 'l',
                                                                   m = 1 + !h * 2, shift = h ? 4 : 1, lm = 1 << m]]])});

// Generated by SDoc 
