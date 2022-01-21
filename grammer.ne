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
  

literal 
  -> %number {% id %}
  | %string {% id %}
  | empty_collection_literal {% id %}
  | sequence_literal {% id %}
  | dictionary_literal {% id %}


# { 1 2 3 4}
# a sequence is either an array or set
# a collection is either a sequence or a dictionary
sequence_literal 
  -> optional_tag "{" _ expression_list _ "}"
    {%
      (data) => {
        const tagName = data[0] || 'array';
        if ( tagName === 'dict'){
          throw new error('You tagged a sequence as a dict')
        }
        return {
          type: tagName + '_literal',
          items: data[3]
        }
      }
    %}


empty_collection_literal
  -> optional_tag "{" _ "}"
    {%
      (data) => {
        const tagName = data[0] || 'array';
        if ( tagName === 'dict'){
          return {
            type: 'dict_literal',
            entries: [] 
          }
        } else {
          return {
            type: tagName + '_literal',
            items: []
          }
        }        
      }
    %}


dictionary_literal
  -> optional_tag "{" _ key_value_pair_list _ "}"
    {%
      (data) => {
        const tagName = data[0] || 'dict';
        if ( tagName !== 'dict'){
          throw new Error("Tagged a dict as a " + tagName);
        }
        return {
          type: 'dict_literal',
          entries: data[3]
        }
      }
    %}


key_value_pair_list
  -> key_value_pair
  {%
    (data) => {
      return [data[0]]
    }
  %}
  | key_value_pair __ key_value_pair_list
  {%
    (data) => {
      return [data[0], ...data[2]]
    }
  %}
  

key_value_pair
  -> expression _ ":" _ expression
  {% 
    (data) => {
      return [data[0], data[4]]
    }
  %}

optional_tag 
  -> null {% () => null %}
  | tag {% id %}


tag ->
  %less_than tag_name %greater_than 
    {% 
        (data) => data[1].value
    %}

tag_name 
  -> "array" {% id %}
  | "dict" {% id %}
  | "set" {% id %}

# optional whitespace
_ 
  -> null
  | __

# mandatory whitespace
__ -> %whitespace 