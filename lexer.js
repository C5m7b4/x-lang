const moo = require('moo');

/*
  plus
  minus
  times
  divide
  left bracket
  right bracket
  colon
  if keyword
  else keyword
  for keyword
  in keyword
  class keyword
*/

let lexer = moo.compile({
  whitespace: /[ \t]+/,
  number: { match: /0|[1-9][0-9]*/, value: Number },
  string: /"(?:\\["\\]|[^\n"\\])*"/,
  left_paren: '(',
  right_paren: ')',
  assignment_op: '=',
  identifier: /[a-zA-Z_][a-zA-Z0-9_]*/,
  nl: { match: /[\r\n]+/, lineBreaks: true },
});

module.exports = lexer;
