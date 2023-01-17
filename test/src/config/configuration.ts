/*
Configuration that makes parameters from config file available
 */

import { Counter } from 'k6/metrics';
import { logResults } from '../utils/log';

type ConfigType = {
  vus: number;
  iterations?: number;
  stages?: Array<{
    duration: string;
    target: number;
  }>;
  usecase: string;
  summaryTrendStats: Array<string>;
  thresholds: {
    [threshold: string]: Array<string>;
  };
  junitCheckOutput: boolean;
};

type EnvType = {
  environments: {
    [environment: string]: {
      host: string;
    };
  };
};

export type ExpectsType = Array<{
  check: string;
  expect: boolean | undefined;
}>;

const env: string = __ENV.environment || 'staging';
const envHosts: EnvType = JSON.parse(open('config/env.json'));

//Default options are different for perfTest or not - vu/duration/iteration can be overrun by cli options
const options =
  __ENV.performanceTest === 'true'
    ? JSON.parse(open('config/performanceConfig.json'))
    : JSON.parse(open('config/functionalConfig.json'));

// *** Functional: Add failed counter ***
let failureCount = new Counter('reqs_failed');

//Configuration parameters for others to use
export const conf = {
  // The host to run tests against
  host(): string {
    return __ENV.host || envHosts.environments[env].host;
  },
  // The usecase to run
  usecase(): string {
    return __ENV.usecase || options.usecase;
  },
  // Where the tests are run from
  runFrom(): string {
    return __ENV.runFrom || 'test';
  },
  // The options descibed in ./*Config.json
  options(): ConfigType {
    return options;
  }
};

//Make metrics available
export const metrics = {
  //Add to failure rate if check is false
  addFailureIf(expect: boolean = false): boolean {
    failureCount.add(!expect);
    return expect;
  },
  //Add to failure rate if one of multiple checks is false
  //Format expectsArray: [{'check': '<description>', 'expect': '<check>'}, {...}, ...]
  checkForFailures(
    urls: string[],
    duration: number,
    requestName: string,
    expectsArray: ExpectsType
  ): boolean {
    let failureArray: string[] = [];
    let passArray: string[] = [];

    const expect = expectsArray.every(value => {
      return value.expect;
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
    logResults(
      requestName,
      urls.join(', '),
      Math.round(duration * 1000) / 1000,
      failureArray,
      passArray
    );

    failureCount.add(!expect);

    return expect;
  }
};
