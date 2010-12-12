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

// | struct()._unsigned_int('foo bar bif').        // three unsigned ints
//            _unsigned_be_int('foob barb bifb').  // big-endian ints
//            _char('xs', 10)                      // an array of 10 chars

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
// ELF generator | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// The ELF generator provides a higher-level interface to a low-level assembler and produces an ELF image from a series of assembled functions and data elements. This ELF can then be linked to
// produce a final executable image. It's just 32-bit for starters, though I may add 64-bit support later on.

  caterwaul.tconfiguration('std seq llasm.numerics', 'llasm.elf', function () {
    this.configure('llasm.struct').llasm /se[_.elf32 = let[struct = _.struct] in {} /se[
      _.header = struct()._char('e_ident', 16)._unsigned_short('e_type e_machine')._unsigned_int('e_version e_entry e_phoff e_shoff e_flags').
                          _unsigned_short('e_ehsize e_phentsize e_phnum e_shentsize e_shnum e_shstrndx'),
      _.phdr   = struct()._unsigned_int('p_type p_offset p_vaddr p_paddr p_filesz p_memsz p_flags p_align'),
      _.shdr   = struct()._unsigned_int('sh_name sh_type sh_flags sh_addr sh_offset sh_size sh_link sh_info sh_addralign sh_entsize'),
      _.symbol = struct()._unsigned_int('st_name st_value st_size')._unsigned_char('st_info st_other')._unsigned_short('st_shndx'),
      _.rel    = struct()._unsigned_int('r_offset r_info'),
      _.rela   = struct()._unsigned_int('r_offset r_info r_addend'),

      _.header.reasonable  = {e_ident: x7f454c46_01010100_00000000_00000000, e_type: 2, e_machine: 3, e_version: 1, e_entry: 0x08048000 + _.header.size() + _.phdr.size(),
                              e_phoff: _.header.size(), e_shoff: 0, e_flags: 0, e_ehsize: _.header.size(), e_phentsize: _.phdr.size(), e_phnum: 1, e_shentsize: 0, e_shnum: 0, e_shstrndx: 0},
      _.phdr.reasonable(s) = let[o = _.header.size() + _.phdr.size()] in
                             {p_type: 1, p_offset: o, p_vaddr: 0x08048000 + o, p_paddr: 0x08048000 + o, p_filesz: s.size(), p_memsz: s.size(), p_flags: 5, p_align: 0x1000},

      _.trivial_code(s) = seq[_.header(_.header.reasonable) + _.phdr(_.phdr.reasonable(s)) + s]]]});

// Generated by SDoc 
// Label assembler | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// Besides providing mnemonics for machine operations, assemblers (perhaps more importantly) set up your relative offsets correctly. This module provides that functionality for sequences. Given a
// sequence with labels (strings) and references (also strings), it removes the strings and sets up the references to point to the correct addresses. Addresses can be relative or absolute, and of
// varying sizes and endianness.

// Formats.
// Label references have several variables. They are:

// | 1. Relative vs. absolute offset (sign extension is not used for absolute)
//   2. Little vs. big endian encoding
//   3. Bit width (8, 16, 32, or 64)

// Absolute offsets need a base origin, which you can specify as a parameter to the linker.

  caterwaul.tconfiguration('std seq', 'llasm.asm', function () {
    this.configure('llasm.struct').llasm.asm = asm /se[

// The expansion process.
// This is kind of delicate. Labels take up space in the initial arrays, so we can't just use the offsets of references to those labels. We first have to get rid of the labels and fill out the
// displacement from the addresses, filling them in destructively at the last minute. For example:

// | qas[xc7c3 /top.a2l    // movl .top, %ebx -- absolute 32-bit LE offset encoded as an array of bytes
//      |+top              // .top:
//      |xeb /top[1].r8]   // jmp .top        -- relative signed 8-bit offset encoded as an array of bytes

// Here, the first step is to render the bytestream without labels and where all addresses have the value 0, yielding xc7_c3_00000000_eb_00. Then we fill in the two addresses destructively to
// obtain xc7_c3_00800408_eb_fe.

// Note that just as in regular assembly language, labels are global! You need to come up with unique label names unless you want to render your assembly pieces separately and link them somehow.

//   Micro-offsets.
//   In the example above, we need to offset the jump pointer by one because the address is positioned before the relative origin (the origin of x86 instructions is the address of the pending
//   instruction). So we need to add one to the relative offset since we're pointing from one byte ahead of where the label is.

      _.pre_expand(xs)      = seq[~xs -x[x instanceof Array ? _.pre_expand(x) : [x]]],
      _.expand(xs, options) = let*[base = options.base || 0, labels  = options.labels || {}, mark_label(l, i)        = (labels[l] = i) /re[[]],
                                                             offsets = {},                   mark_offset(l, f, i, o) = (offsets[l] || (offsets[l] = [])).push([i, f, o]) /re[f(0, 0, 0)],
                                   blanked = let[i = 0] in
                                             seq[~xs -[label(_) ? mark_label(_, i) : address(_) /re.a[a ? mark_offset(a.l, a.f, i, a.o) /se[i += _.length] : [_] /se[++i]]]]] in

                              blanked /se[seq[sp[offsets] *!~o[o[1] *fp[fp[1](labels[o[0]] || null['Undefined label #{o[0]}'], base, fp[0] + fp[2]) /se.b[seq[b *b[_[fp[0] + bi] = b]]]]]]],

      _.encodings = seq[!(~['a', 'r'] -~r[~['8', '6', '2', '4'] -~s[~['', 'l'] *e[['#{r}#{s}#{e}', fn[x, base, p][struct.integral(1 << si, ei, !ri)(ri ? x - p : base + x)]]]]])],

//   Macro-form.
//   There are two ways to use the assembler. One is to use literal sequences of numbers and strings, and other is to use the qas[] macro, which quotes a section of assembly. The latter has
//   notational advantages, including being able to write unquoted labels and having a concise way to indicate address modes.

      let*[expanders = _.expanders = seq[~[]],                               expander_for = _.expander_for(t) = t && seq[expanders %[t.match(_[0])]][0],
           def = _.define_expander(p, e) = def /se[expanders.push([p, e])],  expand(t)    = expander_for(t) /re[_ && _[1].apply(this, t.match(_[0])) || t],
           sub(t, f) = sub /se[def(t, fn[x, y, z][f.replace({x: expand(x), _x: x, y: expand(y), _y: y, z: expand(z), _z: z})])]] in

      this/mb/rmacro /se[sub(qs[_, _], qs[x, y])(qs[_ / _], qs[x, y])(qs[_ | _], qs[x, y])(qs[~_], qs[_x]),
                         def(qs[_[_]._], fn[l, o, f]['"#{f.serialize()}:#{l.serialize()}:#{o.serialize()}"'])(qs[_._], fn[l, f]['"#{f.serialize()}:#{l.serialize()}"'])
                            (qs[+_], fn[l][l.serialize() /re[/^\w+$/.test(_) && '"#{_}"']]),

                         _(qs[qas[_]], fn[x][qs[qg[new s(xs)]].replace({s: new this.ref(caterwaul.seq.finite), xs: expand(x).as('[')})])]],

    where*[asm(xs, options) = asm.expand(asm.pre_expand(xs), options || {}),
           struct           = this.llasm.struct,
           label(x)         = x.constructor === String && /^\w+$/.test(x),
           address(x)       = x.constructor === String && /:/.test(x) && let[ss = x.split(/:/)] in {f: asm.encodings[ss[0]] || null['Invalid offset encoding #{ss[0]} in #{x}'],
                                                                                                    l: ss[1], o: Number(ss[2] || 0)}]});

// Generated by SDoc 