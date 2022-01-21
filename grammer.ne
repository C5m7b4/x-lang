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
function_call -> %identifier _ "(" _ parameter_list _ ")"
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
function_definition -> %identifier _ "(" _ parameter_list _ ")" _ "[" _ %nl statements %nl _ "]"
{%
  (data) => {
    return {
      type: 'function-definition',
      fun_name: data[0],
      parameters: data[4],
      body: data[11]
    }
  }
%}

parameter_list  
  -> null
  {%
    () => []
  %}
  | expression 
  {%
    (data) => {
      return [data[0]]
    }
  %}
  | expression __ parameter_list
  {%
    (data) => {
      return [data[0], ...data[2]]
    }
  %}

expression 
  -> %identifier {% id %}
  | literal {% id %}
  | function_call {% id %}

literal 
  -> 
  %number {% id %}
  | %string {% id %}

_ 
  -> null
  | __


__ -> %whitespace # mandatory whitespace