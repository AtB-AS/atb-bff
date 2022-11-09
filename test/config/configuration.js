/*
Configuration that makes parameters from config file available
 */

import { Rate, Counter, Trend } from 'k6/metrics';
import { check as loadTestingCheck } from 'k6';
import { logResults } from '../utils/log.js';

let env = __ENV.environment || 'staging';
let envHosts = JSON.parse(open('env.json'));
let performanceTest = __ENV.performanceTest === 'true' || false;
//Default options are different for perfTest or not - vu/duration/iteration can be overrun by cli options
let options = performanceTest
  ? JSON.parse(open('performance.json'))
  : JSON.parse(open('functional.json'));

// *** Individual Trend metrics per request name ***
// There may come changes that allows sub-metrics in the summary without specifying these in 'thresholds'.
// This can simplify the need of creating Trends per reqName by adding to a common Trend with reqName tags (https://github.com/k6io/k6/issues/1321)
//let reqNameList = ["realtime"]
let reqNameList = [];
let reqNameTrend = {};
// Initializes each reqName's corresponding Trend
export function setupReqNameTrends() {
  reqNameList.forEach(item => {
    reqNameTrend[item] = new Trend('trend_req_' + item);
  });
}
// ***

// *** Functional: Add failed counter ***
let failureCount = new Counter('reqs_failed');

// *** Performance: Add success rates per group ***
// See comments under 'Individual Trend metrics per request name'
let successRates = {};
// Initializes each group's corresponding success Rate
export function setupSuccessRates() {
  reqNameList.forEach(item => {
    successRates[item] = new Rate('rate_req_success_' + item);
  });
}
// ***

//Configuration parameters for others to use
export const conf = {
  env: () => env,
  host: () => envHosts.environments[env].host,
  usecase: () => __ENV.usecase || options.usecase,
  isPerformanceTest: () => performanceTest,
  includeJunit: () => __ENV.junitCheckOutput || options.junitCheckOutput,
  runFrom: () => __ENV.runFrom || 'test'
};

//Make metrics available
export const metrics = {
  // Performance: Add delay to request name Trend metric
  log: (requestName, delay) => {
    if (reqNameList.includes(requestName)) {
      reqNameTrend[requestName].add(delay);
    } else {
      reqNameTrend['unknown'].add(delay);
    }
  },
  //Manually add to failure rates
  addFailure: requestName => {
    if (conf.isPerformanceTest()) {
      if (requestName in successRates) {
        successRates[requestName].add(false);
      } else {
        successRates['unknown'].add(false);
      }
      successRates['all'].add(false);
    } else {
      failureCount.add(true);
    }
  },
  //Add to failure rate if check is false
  addFailureIf: (requestName, check, expect = false) => {
    if (conf.isPerformanceTest()) {
      if (requestName in successRates) {
        successRates[requestName].add(expect);
      } else {
        successRates['unknown'].add(expect);
      }
      successRates['all'].add(expect);
    } else {
      failureCount.add(!expect);
    }
    return expect;
  },
  //Add to failure rate if one of multiple checks is false
  //Format expectsArray: [{'check': '<description>', 'expect': '<check>'}, {...}, ...]
  //NB! 'urls' is type(Array) to enable multiple urls in functional tests
  addFailureIfMultipleChecks: (urls, duration, requestName, expectsArray) => {
    let failureArray = [];
    let passArray = [];

    let expect = expectsArray.every(value => {
      return value.expect === true;
    });
    if (!expect) {
      expectsArray.filter(item => {
        if (!item.expect) {
          failureArray.push(item.check);
        }
      });
    } else {
      passArray.push('all checks successful');
    }

    //Log (and print) individual failed checks if enabled for functional tests
    if (!conf.isPerformanceTest() && conf.includeJunit) {
      logResults(
        requestName,
        urls.join(', '),
        Math.round(duration * 1000) / 1000,
        failureArray,
        passArray
      );
    }

    if (conf.isPerformanceTest()) {
      if (requestName in successRates) {
        successRates[requestName].add(expect);
      } else {
        successRates['unknown'].add(expect);
      }
      successRates['all'].add(expect);
    } else {
      failureCount.add(!expect);
    }
    return expect;
  },

  //Re-define check from k6: add failure if check fails
  //if junitCheckOutput == true: log check to output at the end of test to be added in junit results
  //NOTE: This is used for performance tests. If 'addFailureIfMultipleChecks' instead, add perfTest checks in there
  check: (
    obj,
    requestName = '',
    expectedStatus = 200,
    conditionArray,
    url = '',
    delay = 0
  ) => {
    let failuresArray = [];
    let passesArray = [];

    //Expected status is checked for all requests - independent of scenario
    let result = loadTestingCheck(
      obj,
      { 'expected status': r => r.status === expectedStatus },
      requestName || {}
    );
    //Add to functional failed checks
    if (!result) {
      failuresArray.push('expected status is ' + expectedStatus);
    } else {
      passesArray.push('expected status is ' + expectedStatus);
    }
    //All checks if functional test is enabled
    if (!conf.isPerformanceTest()) {
      //Print individual failed check if enabled
      if (conf.includeJunit) {
        for (let check in Object.keys(conditionArray)) {
          if (
            !loadTestingCheck(
              obj,
              { check: Object.values(conditionArray)[check] },
              requestName || {}
            )
          ) {
            result = false;
            failuresArray.push(Object.keys(conditionArray)[check].toString());
          } else {
            passesArray.push(Object.keys(conditionArray)[check].toString());
          }
        }
      }
      //Use default check summary - no printing of individual failed checks
      else {
        result = loadTestingCheck(obj, conditionArray, requestName || {});
      }
    }

    //Log (and print) individual failed checks if enabled for functional tests
    if (!conf.isPerformanceTest() && conf.includeJunit) {
      logResults(requestName, url, delay, failuresArray, passesArray);
    }

    //Report on success/fail
    if (conf.isPerformanceTest()) {
      if (requestName in successRates) {
        successRates[requestName].add(result);
      } else {
        successRates['unknown'].add(result);
      }
      //Also possible to add a tag to differentiate on e.g. scenario (see thresholds)
      //successRates["all"].add(result, {mode: conf.isPerformanceTest() ? "performance" : "functional"})
      successRates['all'].add(result);
    } else {
      failureCount.add(!result);
    }
    return result;
  }
};
