/*
Log operations
 */

//Array to keep errors meant for JUnit
let junitChecks: string[] = [];

//Creates log lines for a post-k6 script to pick up
export function createJUnitCheckOutput() {
  console.log('---- JUnit information ----');
  for (let msg of junitChecks) {
    console.log('[junit]' + msg);
  }
}

//Prints any errors to console (see 'config/configuration.js:metrics')
function logErrors(reqName: string, url: string, failureArray: string[]) {
  let outputString = '[FAIL] ' + reqName + ' [URL] ' + url + ' [FAILED_CHECKS]';
  let failureCount = 1;
  if (failureArray.length !== 0) {
    for (let i = 0; i < failureArray.length; i++) {
      outputString += ' ' + failureCount + ') ' + failureArray[i];
      failureCount += 1;
    }
    console.warn(outputString);
  }
}

//Logs all results for junit (see 'config/configuration.js:metrics.check()')
export function logResults(
  reqName: string,
  url: string,
  delay: number,
  failureArray: string[],
  passArray: string[]
) {
  // Print any errors
  logErrors(reqName, url, failureArray);

  // Errors
  for (let i = 0; i < failureArray.length; i++) {
    const junitMsg =
      '[pass] false [req] ' +
      reqName +
      ' [url] ' +
      url +
      ' [check] ' +
      failureArray[i] +
      ' [delay] ' +
      delay;
    junitChecks.push(junitMsg);
  }

  // Passes
  for (let i = 0; i < passArray.length; i++) {
    const junitMsg =
      '[pass] true [req] ' +
      reqName +
      ' [url] ' +
      url +
      ' [check] ' +
      passArray[i] +
      ' [delay] ' +
      delay;
    junitChecks.push(junitMsg);
  }
}
