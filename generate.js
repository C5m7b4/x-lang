const fs = require('fs').promises;
const path = require('path');

const runtime = `
  /*
    runtime functions
  */
  function print(...args){
    console.log(...args);
  }

  function add(...args){
    return args.reduce((sum, num) => sum + num, 0);
  }

  function sub(x, y){
    return x - y;
  }

  function mul(...args){
    return args.reduce((sum, num) => sum * num, 1);
  }

  function div(x, y){
    return x / y;
  }

  function mod(x, y){
    return x % y;
  }

  function abs(n){
    return Math.abs(n);
  }

  function pow(n, m){
    return Math.pow(n, m);
  }

  function sqrt(x){
    return Math.sqrt(x);
  }

  function gt(x, y){
    return x > y;
  }

  function $if(cond, consequent, alternate){
    if ( cond){
      return consequent();
    } else {
      return alternate();
    }
  }

  function map(arr, fun){
    return arr.map(fun);
  }

  function filter(arr, fun){
    return arr.filter(fun);
  }

  function reduce(arr, fun, initValue){
    return arr.reduce(fun, initValue);
  }

  function each(arr, fun){
    return arr.forEach(fun);
  }

`;

async function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.log('Please provide a filename');
    return;
  }

  const astCode = (await fs.readFile(filename)).toString();
  const ast = JSON.parse(astCode);
  const jsCode = generate(ast);
  const baseName = path.basename(filename, '.x.ast');
  const jsFilename = `dist/${baseName}.js`;
  await fs.writeFile(jsFilename, jsCode);
  console.log(`wrote ${jsFilename}`);
}

function generate(node) {
  switch (node.type) {
    case 'program':
      return node.body.map(generate).join(';\n') + ';\n\n' + runtime;
    case 'assignment':
      const varName = node.var_name.value;
      const value = generate(node.value);
      return `let ${varName} = ${value}`;
    case 'function_call':
      const sourceFunctionName = node.fun_name.value;
      const functionName =
        sourceFunctionName === 'if' ? '$if' : sourceFunctionName;
      const params = node.parameters.map(generate).join(', ');
      return `${functionName}(${params})`;
    case 'identifier':
      return node.value;
    case 'string':
      return node.value;
    case 'number':
      return String(node.value);
    case 'function-definition':
      const funName = node.fun_name.value;
      const functionParams = node.parameters.map(generate).join(', ');
      const body = node.body.statements.map(generate).join(';\n') + ';\n';
      const indented = body
        .split('\n')
        .map((line) => '\t' + line)
        .join('\n');
      return `function ${funName} (${functionParams}){\n${indented}\n}`;
    case 'code_block':
      const codeBlockBody = node.statements.map(generate).join(';\n') + ';\n';
      const codeBlockParams = node.parameters.map(generate).join(', ');
      const indentedCodeBlockBody = codeBlockBody
        .split('\n')
        .map((line) => '\t' + line)
        .join('\n');
      return `function(${codeBlockParams}) {\n${indentedCodeBlockBody}\n}`;
    case 'array_literal':
      const items = node.items.map(generate).join(', ');
      return `[${items}]`;
    default:
      throw new Error(`unknown node type: ${node.type}`);
      break;
  }
}

main().catch((err) => console.log(err.stack));
