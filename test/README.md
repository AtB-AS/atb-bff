# API tests

API-tests of the BFF. The tests are written in TypeScript and run by the k6
test tool (https://k6.io/docs/), which mainly is used for performance testing -
i.e. enables the API-tests also to be used for performance. See 
[here](https://k6.io/docs/get-started/installation/) for installation of k6.

### Run modes

- Functional test: 1 user and 1 iteration
- Performance test: X users over Y seconds (see _config/performanceConfig.json_)
  - _FUTURE POSSIBILITY_

### API-tests

Each BFF endpoint is run with a list of assertions. These are structured in
folders `v1` and `v2`.

The configuration of the tests are located in `config/functionalConfig.json`, and
environments in `config/env.json`. In addition, the host can be specified through `--env host=https://...`

### Commands

Build runnable code with webpack (builds into the `dist` folder)

```bash
test$  yarn webpack
```

Run functional tests - default: 1 user, 1 iteration, "bff" usecase

```bash
test$  k6 run dist/k6.js --env [environment=[staging, prod] || host=https://...]
```

Run performance test (_FUTURE POSSIBILITY_) - default: 5 user, 300s duration +
ramp-up/-down, "bffPerformanceTest" usecase

```bash
test$  k6 run k6.js --env [environment=[staging, prod] || host=https://...] --env performanceTest=true
```

Github Actions run with a console log print to file for JUnit creation of the
assertion results. Resulting JUnit file will be stored in
`dist/results/combinedJUnit.xml` (see also `.github/workflows/api-tests.yml`).

```bash
test$  k6 run dist/k6.js --env [environment=[staging, prod] || host=https://...]
test$  python3 python-tools/apiCheckToJUnit/apiCheckToJUnit.py --file junitLog.txt --folder dist/results
test$  python3 python-tools/combineJUnit/combineJUnit.py --files junit_bff.xml,junitFromChecks.xml --folder dist/results
```

### Docker

The tests can also be run in a Docker container, based on `Dockerfile.test`:

```bash
root$ docker build -t 'gcr.io/atb-mobility-platform/atb-bff-test:sha' -f 'Dockerfile.test' .
root$ docker run -e host=https://atb-staging.api.mittatb.no gcr.io/atb-mobility-platform/atb-bff-test:sha
```

If all tests are OK, the returned error code is `0`, otherwise `!= 0`.

### Detailed output

For detailed output, use (also see _k6.json#handleSummary()_)

```bash
test$  k6 run dist/k6.js --env [environment=[staging, prod] || host=https://...] --out csv=dist/results/output.csv
or
test$  k6 run dist/k6.js --env [environment=[staging, prod] || host=https://...] --out json=dist/results/output.json
```

For debugging

```bash
test$  k6 run dist/k6.js --env [environment=[staging, prod] || host=https://...] [--http-debug || --http-debug="full"]
```
