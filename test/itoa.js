// Integer-to-string conversion.
// Implements this logic:

// | movl $123456789, %eax
//   .top:
//     xorl %edx, %edx
//     movl $10, %ebx
//     idiv %ebx
//     pushl %eax          ; quotient
//     addl $0x30, %edx    ; remainder + 48 (digit)
//     pushl %edx
//     movl $4, %eax       ; write
//     movl $1, %ebx       ; FD = 1 (stdout)
//     movl %esp, %ecx     ; data is on the stack (little-endian)
//     subl $3, %ecx
//     movl $1, %edx       ; one byte
//     int $0x80
//     popl %edx
//     popl %eax
//     testl %eax, %eax
//     ja .top
//   xorl %ebx, %ebx
//   movl $1, %eax
//   int $0x80

caterwaul.clone('std seq llasm.numerics llasm.elf llasm.asm llasm.struct')(function (require) {
  var prelude = qas[x8b /b00_000101 /number.a2l],
      exit    = qas[x31db, xb8 /xl00000001, xcd80],
      number  = qas[+number, ~caterwaul.llasm.struct()._unsigned_int('n')({n: 123456789})],
      loop    = qas[+top | x31d2, xbb /xl0000000a, xf7fb, x50, x81c2 /xl00000030, x52, xb8 /xl00000004, xbb /xl00000001, x89 /b11_100001
                         | xba /xl00000001, xcd80, x5a, x58, x85c0, x77 /top[1].r8],

      bytes   = caterwaul.llasm.elf32.trivial_code(caterwaul.llasm.asm(seq[prelude + loop + exit + number], {base: 0x08048054}));

  require('fs') /se.fs[fs.writeFile('test/itoa', new Buffer(bytes.length) /se.bs[seq[bytes *![bs[_i] = _]]], fn_[fs.chmodSync('test/itoa', 0700)])];
})(require);

// Generated by SDoc 
