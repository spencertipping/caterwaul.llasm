// C-style structure definition | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Acknowledgements.
// The floating-point conversion code (when it ends up being written) will be based heavily on Jonas Raoni Soares Silva's implementation, available at http://jsfromhell.com/classes/binary-parser.

// Disclaimers.
// This code probably won't work in a lot of places. It only really needs to work in a couple of JS environments, Node being one of them. It's unlikely that you'll be in an environment where it's
// OK to link to C code or generate executables that do, so I figure a certain lack of portability is acceptable.

  caterwaul.tconfiguration('std seq', 'llasm.struct', function () {
    this.namespace('llasm').struct = struct /se[
      _.field(length, to, from)                = fn_[to.apply(this, arguments)] /se[_.inverse = from, _.length = length],
      _.array(n, type)                         = struct() /se[seq[(n >>>[_ + 1] <<[_ < n]) *!i[_.add(i, type)]]],
      _.integral(bytes, little_endian, signed) = let[offsets = seq[(naturals <<[_ < bytes]) *[(little_endian ? _ : bytes - (_ + 1)) << 3]]] in
                                                 _.field(bytes, fn[x][seq[offsets *[(signed ? x >> _ : x >>> _) & 0xff]]], fn[xs][seq[offsets *[xs[_i] << _] /[_ | _0]]]),

      _.methods = {} /se[_.add(name, field) = this /se[seq[~name.split(/\s+/) *!n[_.length += field.length, _.field_names.push(n), _.fields.push(field)]]],
                         seq[~'char short int long'.split(/\s+/) *~[~[['_unsigned_#{_}', 1 << _i], ['_#{_}', 1 << _i]]] /~[_ + _0]
                                                                 *!t[_[t[0]](name, n) = this.add(name, struct.integral(t[1], true, ti & 1) /re[n ? struct.array(n, _) : _])]]]],
    where*[naturals = seq[0 >>>[_ + 1]],
           struct() = let*[f(x) = f.transform(x)] in caterwaul.util.merge(f, struct.methods) /se[
                        _.fields            = seq[~[]],
                        _.field_names       = seq[~[]],
                        _.length            = 0,
                        _.transform(x)      = seq[_.field_names *n[_.fields[ni](x[n])] /~[_ + _0]],
                        _.inverse(bytes, o) = seq[!(_.fields *f[[_.field_names[fi], f.inverse(bytes, o) /se[o += f.length]]] %[_[0]])]]]});

// Generated by SDoc 
