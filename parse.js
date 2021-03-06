const nearley = require('nearley');
const grammer = require('./grammer.js');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');

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
    console.warn('The parse tree generates multiple results');
    console.log(util.inspect(parser.results, { depth: 10 }));
  } else if (parser.results.length === 0) {
    console.error('unexpected end of file');
    process.exit(1);
  } else {
    const astFilename = path.basename(filename) + '.ast';
    const ast = parser.results[0];
    const astFullPath = 'asts/' + astFilename;
    await fs.writeFile(astFullPath, JSON.stringify(ast, null, ' '));
    console.log(`Wrote ${astFilename}`);
  }
}

main().catch((err) => console.log(err.stack));
