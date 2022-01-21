@{%
const lexer = require('./lexer')
%}

@lexer lexer

program
  -> statements
  {%
    (data) => {
      return {
        type: "program",
        body: data[0]
      }
    }
  %}

statements
  -> null
  {%
    () => []
  %}
  | _ statement _
  {%
    (data) => [data[1]]
  %}
  | _ statement _ %nl:+ statements
  {%
    (data) => [data[1], ...data[4]]
  %}

statement ->
  assignment {% id %}
  | function_call {% id %}
  | function_definition {% id %}

assignment -> %identifier _ "=" _ expression
  {%
    (data) => {
      return {
        type: "assignment",
        var_name: data[0],
        value: data[4]
      }
    }
  %}


# doIt(a b c)
function_call -> %identifier _ "(" _ expression_list _ ")"
  {%
    (data) => {
      return {
        type: 'function_call',
        fun_name: data[0],
        parameters: data[4]
      }
    }
  %}


# doIt(a b c)[
# ...  
#]
function_definition -> %identifier _ "(" _ expression_list _ ")" _ code_block_wo_parameters
{%
  (data) => {
    return {
      type: 'function-definition',
      fun_name: data[0],
      parameters: data[4],
      body: data[8]
    }
  }
%}

code_block 
  -> code_block_wo_parameters
  | %left_bracket _ code_block_parameters _ %nl statements %nl _ %right_bracket
    {%
      (data) => {
        return {
          type: 'code_block',
          parameters: data[2],
          statements: data[5]
        }
      }
    %}

code_block_wo_parameters
  -> %left_bracket _ %nl statements %nl _ %right_bracket
    {%
      (data) => {
        return {
          type: 'code_block',
          statements: data[3]
        }
      }
    %}

code_block_parameters -> %bar _ expression_list _ %bar
  {%
    (data) => {
      return data[2]
    }
  %}

expression_list  
  -> expression 
  {%
    (data) => {
      return [data[0]]
    }
  %}
  | expression __ expression_list
  {%
    (data) => {
      return [data[0], ...data[2]]
    }
  %}

expression 
  -> %identifier {% id %}
  | literal {% id %}
  | function_call {% id %}
  | code_block {% id %}
  | array_literal {% id %}

literal 
  -> 
  %number {% id %}
  | %string {% id %}

# { 1 2 3 4}
array_literal 
  -> "{" _ expression_list _ "}"
    {%
      (data) => {
        return {
          type: 'array_literal',
          items: data[2]
        }
      }
    %}
  | "{" _ "}"
    {%
      (data) => {
        return {
          type: 'array_literal',
          items: []
        }
      }
    %}

# optional whitespace
_ 
  -> null
  | __

# mandatory whitespace
__ -> %whitespace 