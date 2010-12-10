// C-style structure definition | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// This code gives you a way to produce binary-compatible APIs against C structures. It isn't complete yet, but it's currently used in the ELF generator.

//   Acknowledgements.
//   The floating-point conversion code (when it ends up being written) will be based heavily on Jonas Raoni Soares Silva's implementation, available at
//   http://jsfromhell.com/classes/binary-parser.

//   Disclaimers.
//   This code probably won't work in a lot of places. It only really needs to work in a couple of JS environments, Node being one of them. It's unlikely that you'll be in an environment where
//   it's OK to link to C code or generate executables that do, so I figure a certain lack of portability is acceptable.

// Supported encodings.
// Right now it just encodes integers in various widths, endian-encodings, and signedness. For example:

// | struct()._unsigned_int('foo bar bif')         // three unsigned ints
//   struct()._unsigned_be_int('foo bar bif')      // big-endian ints

  caterwaul.tconfiguration('std seq', 'llasm.struct', function () {
    this.namespace('llasm').struct = struct /se[
      _.field(length, to, from)                = fn_[to.apply(this, arguments)] /se[_.inverse = from, _.size() = length],
      _.array(n, type)                         = struct() /se[seq[(naturals <<[_ < n]) *!i[_.add(i, type)]]],
      _.integral(bytes, little_endian, signed) = let[offsets = seq[(naturals <<[_ < bytes]) *[(little_endian ? _ : bytes - (_ + 1)) << 3]]] in
                                                 _.field(bytes, fn[x][seq[offsets *[(signed ? x >> _ : x >>> _) & 0xff]]], fn[xs][seq[offsets *[xs[_i] << _] /[_ | _0]]]),

      _.methods = {} /se[_.add(name, field) = this /se[seq[qw(name) *!n[_.field_names.push(n), _.fields.push(field)]]],
                         seq[~'char short int long'.split(/\s+/) *~[~[['_unsigned_#{_}', 1 << _i], ['_#{_}', 1 << _i], ['_unsigned_be_#{_}', 1 << _i], ['_be_#{_}', 1 << _i]]] /~[_ + _0]
                                                                 *!t[_[t[0]](name, n) = this.add(name, struct.integral(t[1], ! /_be_/.test(t[0]), ti & 1) /re[n ? struct.array(n, _) : _])]]]],
    where*[naturals = seq[0 >>>[_ + 1]],
           qw(s)    = s.split ? seq[~s.split(/\s+/)] : seq[~[s]],
           struct() = let*[f(x) = f.transform(x)] in caterwaul.util.merge(f, struct.methods) /se[
                        _.fields      = seq[~[]],  _.transform(x)      = seq[_.field_names *n[_.fields[ni](x[n])] /~[_ + _0]] || seq[~[]],
                        _.field_names = seq[~[]],  _.inverse(bytes, o) = seq[!(_.fields *f[[_.field_names[fi], f.inverse(bytes, o) /se[o += f.length]]] %[_[0]])],
                                                   _.size()            = seq[this.fields *[_.size()] /[_ + _0]]]]});

// Generated by SDoc 
