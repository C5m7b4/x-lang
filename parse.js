const nearley = require('nearley');
const grammer = require('./grammer.js');
const fs = require('fs').promises;
const path = require('path');

async function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.log('please provide a filename');
    return;
  }

  const code = (await fs.readFile(filename)).toString();
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammer));

  parser.feed(code);

  if (parser.results.length > 1) {
    console.warn('The parse tree generates multiple result');
    console.log(parser.results);
  } else {
    const astFilename = path.basename(filename) + '.ast';
    const ast = parser.results[0];
    await fs.writeFile(astFilename, JSON.stringify(ast, null, ' '));
    console.log(`Wrote ${astFilename}`);
  }
}

main().catch((err) => console.log(err.stack));
