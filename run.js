const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

async function main() {
  // parse the file
  const filename = process.argv[2];
  await myExec(`node parse.js src/${filename}`);
  await myExec(`node generate.js asts/${filename}.ast`);

  // run the javascript file
  const jsFilename = path.basename(filename, '.x') + '.js';
  await myExec(`node dist/${jsFilename}`);
}

async function myExec(command) {
  console.log(command);
  const result = await exec(command);
  process.stdout.write(result.stdout);
  process.stdout.write(result.stderr);
}

main().catch((err) => console.log(err.stack));
