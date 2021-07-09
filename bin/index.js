#!/usr/bin/env node

const pkg = require('../package')
const argv = require('minimist')(process.argv.slice(2));
if (argv['_'].length < 1 || typeof argv['h'] !== 'undefined'){
  console.error("================================================================================");
  console.error(pkg.description);
  console.error("");
  console.error(`Author     : ${pkg.author.name} <${pkg.author.email}>`);
  console.error(`Homepage   : ${pkg.author.url}`);
  console.error(`LICENSE    : ${pkg.license}`);
  console.error("================================================================================");
  console.error("");
  console.error("Usage: smtc [-h] <file> [-s <0|1|2... (1:default)>] [-t <t|m|c|d (t:default)>]");
  console.error("");
  process.exit(1);
}

const fs = require('fs');
const StateDesignEngine = require('../src/StateDesignEngine');
const s = new StateDesignEngine();
const swi = argv['s'] && parseInt(argv['s']) >= 0 ? argv['s'] : 0;
const nCoverage = s.setScript(require('fs').readFileSync(argv['_'][0],'utf8'))
  .createMatrix()
  .nCoverage(swi);
switch(argv['t']){
  case "d":
    s.printDiagram();
    break;
  case "m":
    s.printStateEventMatrix();  //transition matrix
    break;
  case "c":
    s.printNSwitch(nCoverage);
    break;
  default:
    s.printNSwitchMatrix(nCoverage);
    break;
}