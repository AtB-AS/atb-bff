/*
Configuration that makes parameters from config file available
 */

import { Counter } from "k6/metrics";
import { logResults } from "../utils/log";

const env: string = __ENV.environment || "staging";

const envHosts = JSON.parse(open("config/env.json"));

//Default options are different for perfTest or not - vu/duration/iteration can be overrun by cli options
const options = JSON.parse(open("config/functional.json"));

// *** Functional: Add failed counter ***
let failureCount = new Counter("reqs_failed");

//Configuration parameters for others to use
export const conf = {
  env(): string {
    return env;
  },
  host(): string {
    return envHosts.environments[env].host;
  },
  usecase(): string {
    return __ENV.usecase || options.usecase;
  },
  runFrom(): string {
    return __ENV.runFrom || "test";
  },
};

export type ExpectsType = Array<{
  check: string;
  expect: boolean | undefined;
}>;

//Make metrics available
export const metrics = {
  //Add to failure rate if check is false
  addFailureIf(expect: boolean = false): boolean {
    failureCount.add(!expect);
    return expect;
  },
  //Add to failure rate if one of multiple checks is false
  //Format expectsArray: [{'check': '<description>', 'expect': '<check>'}, {...}, ...]
  addFailureIfMultipleChecks(
    urls: Array<string>,
    duration: number,
    requestName: string,
    expectsArray: ExpectsType
  ): boolean {
    let failureArray: Array<string> = [];
    let passArray: Array<string> = [];

    let expect = expectsArray.every((value) => {
      return value.expect;
    });
    if (!expect) {
      expectsArray.filter((item) => {
        if (!item.expect) {
          failureArray.push(item.check);
        }
      });
    } else {
      passArray.push("all checks successful");
    }

    //Log (and print) individual failed checks if enabled for functional tests
    logResults(
      requestName,
      urls.join(", "),
      Math.round(duration * 1000) / 1000,
      failureArray,
      passArray
    );

    failureCount.add(!expect);

    return expect;
  },
};
