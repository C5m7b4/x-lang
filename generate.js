const fs = require('fs').promises;
const path = require('path');

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
  if (node.type === 'program') {
    return node.body.map(generate).join('\n');
  } else if (node.type === 'assignment') {
    const varName = node.var_name.value;
    const value = node.value.value;
    return `let ${varName} = ${value};`;
  } else if (node.type === 'function_call') {
    const functionName = node.fun_name.value;
    const params = node.parameters.map(generate).join(', ');
    return `${functionName}(${params})`;
  }
}

main().catch((err) => console.log(err.stack));
