// IA32/SSE2 low-level assembler | Spencer Tipping
// Licensed under the terms of the MIT source code license

// Introduction.
// This assembler generates machine code for the IA32 architecture with SSE2 extensions. It is not by any means complete; lots of instructions and operand types are not supported. For example,
// there is no support for the 387 instruction set, single-word GPR instructions, binary-encoded decimal instructions, segment register operands, etc. The purpose of this module is purely to
// generate modern userspace executable images suitable for JIT compilation.

// I highly recommend consulting the Intel processor manuals, available from http://www.intel.com/products/processor/manuals, if you're unfamiliar with this stuff. They go over all of the machine
// encodings, operand formats, etc. Appendix B.2 is particularly helpful, as it presents a concise representation of how to encode each instruction for each major case. Also, for a more
// down-to-earth explanation of what's going on, I recommend http://www.c-jump.com/CIS77/CPU/x86/index.html; this goes over the more confusing parts of the Intel manuals such as ModR/M and SIB
// encoding.

// By the way, the documentation here was written while reading through (and learning/trying to understand) the Intel processor manuals. A lot of it is for my benefit later on; some stuff that
// may not seem relevant is included because the manuals mention it.

  caterwaul.tconfiguration('std seq', 'llasm.ia32-sse2', function () {
    let*[

// Instruction prefixes.
// There aren't any instruction prefixes that I end up generating. Neither GCC nor ICC uses branch-hint prefixes in generated code (implying that static branch hints perform more poorly than the
// processor's dynamic branch predictor), and the repeat prefixes would rarely be used in properly vectorized code. There are some prefixes required by certain instructions, but they are encoded
// as a part of the instruction opcode rather than as prefixes. Finally, REX is used only for 64-bit stuff (the bit layout is quite a hack :) ).

// Little/big-endian conversion.
// Any instruction that takes a displacement or immediate will require quantities to be in little-endian format. These functions swap endianness for 16 and 32-bit numbers:

  se16(n) = (n & 0xff) << 8  | (n & 0xff00) >> 8,
  se32(n) = (n & 0xff) << 24 | (n & 0xff00) << 8 | (n & 0xff0000) >> 8 | (n & 0xff000000) >> 24,

// Register indexes.
// Registers are always referred to by bitwise index. The indexes are (minus xmmN indexes, which are obvious):

  ri = {eax: 0, ecx: 1, edx: 2, ebx: 3, esp: 4, ebp: 5, esi: 6, edi: 7},

// ModR/M and SIB encoding.
// There are four basic cases for R/M or SIB addressing, plus a couple of exceptions for SIB escaping. They are these:

// | 1. mod = b00 and r/m !== b10X (esp or ebp). r/m is an indirected register, e.g. mod = b00, r/m = 000 specifies (eax).
//   2. mod = b00 and r/m === b100 (esp). SIB is used directly.
//   3. mod = b00 and r/m === b101 (ebp). 32-bit displacement is used directly.
//   4. mod = b01 and r/m !== b100 (esp). r/m is indirected, plus a signed 8-bit displacement.
//   5. mod = b10 and r/m !== b100 (esp). r/m is indirected, plus a signed 32-bit displacement.
//   6. mod = b11. r/m is a direct register value.

// Within the SIB byte, the high two bits (scale) determine the multiplier of the scaled register; 00 = 1, 01 = 2, 10 = 4, and 11 = 8. It isn't possible to scale esp (which makes sense). The next
// three bits (index) contain the register to be scaled, and the last three (base) contain the base offset. Using ebp as a base offset does some weird things. If mod is b00, then it throws ebp
// away and just uses a 32-bit displacement (plus the scaled quantity). For mod = b01, you get an 8-bit displacement plus the value of ebp. For mod = b10, you get 32-bit displacement plus ebp.
// When mod = b11, you just get ebp with no displacement.

// Integer arithmetic instructions.
// These all follow some conventions. The LSB of the opcode determines size (0 is 8-bit, 1 is 32-bit), the MSB indicates the presence of an immediate operand (which converts the direction bit
// into an 'extend-the-sign-of-the-immediate-byte' flag), and the second-lowest bit is a direction flag (if 0, then assign from memory to register, otherwise assign from register to memory).
// These all have short forms for EAX, so use those if possible.

  integer_arithmetic = {add: 0, or: 1, adc: 2, xor: 3, and: 4, sbb: 5, sub: 6, cmp: 7},


// Generated by SDoc 
