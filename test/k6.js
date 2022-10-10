/*
- Functional test: 1 user and 1 iteration
- Performance test: X users over Y seconds (see config/performance.json)
    - NB! NOT FULLY SUPPORTED at the moment

Run (functional tests) - default: 1 user, 1 iteration
$  k6 run k6.js --config=config/functional.json --env environment=[staging, prod] --env usePhoneLogIn=true
Run (performance test) - default: 5 user, 300s duration + ramp-up/-down, "bffPerformanceTest" usecase
$  k6 run k6.js --config=config/performance.json --env environment=[staging, prod] --env performanceTest=true

With detailed output (see k6.json#handleSummary())
$  k6 run k6.js --config=config/functional.json  --env environment=[staging, prod] --out csv=results/output.csv
Debugging
$  k6 run k6.js --config=config/functional.json --env environment=[staging, prod] [--http-debug || --http-debug="full"]

Metrics (only performance tests):
- response time trends per request
- successful rate per request
--> all request names are defined in 'config/configuration.js#reqNameList)
 */

import { sleep } from 'k6';
import { conf } from './config/configuration.js';
import { scn } from './scenario.js';
import { createJUnitCheckOutput } from './utils/log.js';
//WIP
import {
  jUnit,
  textSummary
} from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

//Performance: Setup a Trend metric per request name from conf/configuration.reqNameList
//setupReqNameTrends()
//Performance: Setup a Rate metric per group name from conf/configuration.groupList
//setupSuccessRates()

//Settings for the simulation
export let options = {
  //vus / duration / iterations set in config file depending on performance test or not (can be overrun by cli options)
  //All custom metrics are defined in 'conf/configuration.js'
  //thresholds are set in config file (config/functional.json and config/performance.json)
};

//Before the simulation starts
export function setup() {
  console.log('Setup');
  console.log('  -- Usecase: ' + conf.usecase());
  console.log('  -- Environment: ' + conf.host());
}

//Run simulations
export default function () {
  //Set up the tests for each VU in the first iteration
  if (__ITER === 0) {
    //Any initialization
  }
  //Run usecase as defined from config - or cli
  scn[conf.usecase()]();

  //Create JUnit log lines for a post-k6 to pick up
  if (!conf.isPerformanceTest() && conf.includeJunit()) {
    createJUnitCheckOutput();
  }
}

//Handle reporting
export function handleSummary(data) {
  console.log('Preparing the end-of-test summary...');

  //github actions
  if (conf.runFrom() === 'root') {
    return {
      stdout: textSummary(data, { indent: ' ', enableColors: true }),
      'test/results/junit_bff.xml': jUnit(data),
      'test/results/summary_bff.json': JSON.stringify(data)
    };
  }
  //default: 'test'
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'results/junit_bff.xml': jUnit(data),
    'results/summary_bff.json': JSON.stringify(data)
  };
}

//After the simulation ends
export function teardown() {
  console.log('Teardown');
}
