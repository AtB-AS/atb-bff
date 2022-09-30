# API tests

API-tests of the BFF. The tests are scripted in JavaScript and run by the k6 test tool (https://k6.io/docs/), 
which mainly is used for performance testing - i.e. enables the API-tests also to be used for performance. 

### Run modes
- Functional test: 1 user and 1 iteration
- Performance test: X users over Y seconds (see _config/performance.json_)
  - _CURRENTLY NOT FULLY SUPPORTED_
  
### API-tests
Each BFF endpoint is run with a list of assertions. These are structured in folders `v1` and `v2`.

The configuration of the tests are located in `config/functional.json`, and environments in `config/env.json`.

### Commands
Run functional tests - default: 1 user, 1 iteration, "bff" usecase
```bash
test$  k6 run k6.js --config=config/functional.json --env environment=[staging, prod]
```

Run performance test (NOT FULLY SUPPORTED) - default: 5 user, 300s duration + ramp-up/-down, "bffPerformanceTest" usecase
```bash
test$  k6 run k6.js --config=config/performance.json --env environment=[staging, prod] --env performanceTest=true
```

Github Actions run with a console log print to file for JUnit creation of the assertion results. Resulting JUnit file
will be stored in `results/combinedJUnit.xml` (see also `.github/workflows/api-tests.yml`).
```bash
test$  k6 run k6.js --config=config/functional.json --env environment=[staging, prod]
test$  python3 python-tools/apiCheckToJUnit/apiCheckToJUnit.py --file junitLog.txt --folder results
test$  python3 python-tools/combineJUnit/combineJUnit.py --files junit_bff.xml,junitFromChecks.xml --folder results
```

### Detailed output
For detailed output, use (also see _k6.json#handleSummary()_)
```bash
test$  k6 run k6.js --config=config/functional.json  --env environment=[staging, prod] --out csv=results/output.csv
or
test$  k6 run k6.js --config=config/functional.json  --env environment=[staging, prod] --out json=results/output.json
```
For debugging
```bash
test$  k6 run k6.js --config=config/functional.json --env environment=[staging, prod] [--http-debug || --http-debug="full"]
```

### Performance test metrics
All request names are defined in _config/configuration.js#reqNameList_, and gives:
- response time trends per request
- successful rate per request
