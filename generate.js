const fs = require('fs').promises;
const { readFileSync } = require('fs');
const path = require('path');
const RUNTIME = readFileSync(path.join(__dirname, 'runtime.js')).toString();

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
      return node.body.map(generate).join(';\n') + ';\n\n' + RUNTIME;
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
      return generateFunction(
        node.body.statements,
        node.parameters,
        node.fun_name.value
      );
    case 'code_block':
      return generateFunction(node.statements, node.parameters);
    case 'array_literal':
      const items = node.items.map(generate).join(', ');
      return `[${items}]`;
    case 'set_literal':
      const setItems = node.items.map(generate).join(', ');
      return `new Set([${setItems}])`;
    case 'dict_literal':
      const entries = node.entries
        .map((entry) => {
          const [key, value] = entry;
          const keyExpr = generate(key);
          const valueExpr = generate(value);
          return `[${keyExpr}, ${valueExpr}]`;
        })
        .join(', ');
      return `new Map([${entries}])`;
    default:
      throw new Error(`unknown node type: ${node.type}`);
      break;
  }
}

function generateFunction(statements, parameters, name = '') {
  const body =
    statements
      .map((statement, idx) => {
        const js = generate(statement);
        if (idx === statements.length - 1) {
          return `\treturn ${js}`;
        } else {
          return js;
        }
      })
      .join(';\n') + ';\n';
  const params = parameters.map(generate).join(', ');
  const indentedCodeBlockBody = body
    .split('\n')
    .map((line) => '\t' + line)
    .join('\n');
  return `function ${name}(${params}) {\n${body}\n}`;
}

main().catch((err) => console.log(err.stack));
