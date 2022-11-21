/*
- Functional test: 1 user and 1 iteration
- Performance test: X users over Y seconds (see config/performance.json)
    - NB! CURRENTLY NOT IMPLEMENTED

Run (functional tests) - default: 1 user, 1 iteration, usecase 'bff'
$  yarn webpack
$  k6 run dist/k6.js --config=dist/config/functional.json --env environment=[staging, prod]

With detailed output (see k6.json#handleSummary())
$  yarn webpack
$  k6 run dist/k6.js --config=dist/config/functional.json  --env environment=[staging, prod] --out csv=results/output.csv
Debugging
$  yarn webpack
$  k6 run dist/k6.js --config=dist/config/functional.json --env environment=[staging, prod] [--http-debug || --http-debug="full"]
 */

import { Options } from 'k6/options';
import { conf } from './config/configuration';
import { scn } from './scenario';
import { createJUnitCheckOutput } from './utils/log';
//WIP
/* @ts-ignore */
import {
  jUnit,
  textSummary
} from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

//Settings for the simulation
export let options: Options = {
  //vus / duration / iterations set in config file
  //All custom metrics are defined in 'conf/configuration'
  //thresholds are set in config file (config/functional.json and possibly config/performance.json)
};

//Before the simulation starts
export function setup() {
  console.log('Setup');
  console.log('  -- Usecase: ' + conf.usecase());
  console.log('  -- Environment: ' + conf.host());
}

//Run simulations
export default () => {
  //Set up the tests for each VU in the first iteration
  if (__ITER === 0) {
    //Any initialization
  }
  //Run usecase as defined from config - or cli
  scn(conf.usecase());

  //Create JUnit log lines for a post-k6 to pick up
  createJUnitCheckOutput();
};

//Handle reporting
export const handleSummary = (data: object) => {
  console.log('Preparing the end-of-test summary...');
  console.log('-- ' + conf.runFrom());
  console.log('-- ' + conf.host());

  //github actions
  if (conf.runFrom() === 'root') {
    return {
      stdout: textSummary(data, { indent: ' ', enableColors: true }),
      'test/dist/results/junit_bff.xml': jUnit(data),
      'test/dist/results/summary_bff.json': JSON.stringify(data)
    };
  }
  //default: 'dist'
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'dist/results/junit_bff.xml': jUnit(data),
    'dist/results/summary_bff.json': JSON.stringify(data)
  };
};

//After the simulation ends
export function teardown() {
  console.log('Teardown');
}
