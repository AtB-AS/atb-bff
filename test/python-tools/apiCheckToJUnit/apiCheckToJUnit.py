import getopt
import sys
import os
import re
import xml.etree.ElementTree as ET
import datetime

'''
# Create a JUnit file based on console output of a specific format from a k6 test
$  k6 run tests.js --config=config/functional.json --env environment=staging --env junitCheckOutput=true --log-output=stdout --logformat=raw 2> junitLog.txt
or
$  k6 run tests.js --config=config/functional.json --env environment=staging --env junitCheckOutput=true --log-output=stdout --logformat=raw | tee junitLog.txt

# Start
$ apiCheckToJUnit.py --file <txt file with log> --folder <folder for input file and store junit xml>
    -> file: file + extension
    -> folder: path (relative is OK)

# Note
- The scripts look for prefix [junit] in the txt file
    example ->
    [junit][pass] true [req] searchByOrgNo [url] https://...search=NO985815534&limit=2 [check] expected status is 200 [delay] 604.064
    [junit][pass] false [req] searchByOrgNo [url] https://...search=NO985815534&limit=2 [check] is valid [delay] 604.064
    ...
- The output Junit XML is with only one testsuite
    - originally made accoring to format for Azure Pipeline (https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/test/publish-test-results?view=azure-devops&tabs=junit%2Cyaml#result-formats-mapping)
    -> createJunit()
    -> Also available method for one testsuites per reqName: createJunitManyTestsuites()
    
# Example
$ python3 python-tools/apiCheckToJUnit/apiCheckToJUnit.py --file junitLog.txt --folder api-tests/src/main/k6/results

# Output as JUnit xml
Creates a testsuite with testcases for each test
-> {folder}/junitFromChecks.xml
'''


def main(argv):
    # Init parameters
    file = ''
    folder = ''
    abs1 = False
    abs2 = False

    # Input parameters
    try:
        opts, args = getopt.getopt(argv, "", ["file=", "folder="])
    except getopt.GetoptError:
        print('apiCheckToJUnit.py --file <txt file with log> --folder <folder for input file and store junit xml>')
        sys.exit()
    for opt, arg in opts:
        if opt == '--file':
            file = arg
            abs1 = True
        elif opt == '--folder':
            folder = arg
            abs2 = True
    # Check that the non optional parameters are set
    if not abs1 or not abs2:
        print('Missing "--file" and/or "--folder" parameter')
        print('apiCheckToJUnit.py --file <txt file with log> --folder <folder for input file and store junit xml>')
        sys.exit()
    # Check that file exists
    if not os.path.isfile(folder + "/" + file):
        print("File {} does not exist. Exiting...".format(folder + "/" + file))
        sys.exit()

    # Working varaiables
    inputFile = "{}/{}".format(folder, file)
    junitFile = "{}/junitFromChecks.xml".format(folder)
    apiChecks = {}

    # Read log file and find all [junit] log items
    # [junit][pass] false [req] searchByName [url] https://... [check] expected status is 200
    with open(inputFile) as logFile:
        for line in logFile:
            if re.search("^\\[junit\\].*$", line):
                # Classify by reqName and check for pass true | false
                # msg = re.findall("\\[junit\\]\\[pass\\]\\s(.*)\\s\\[req\\]\\s(.*)\\s\\[url\\]\\s(.*)\\s\\[check\\]\\s(.*)", line)[0]
                msg = re.findall("\\[junit\\]\\[pass\\]\\s(.*)\\s\\[req\\]\\s(.*)\\s\\[url\\]\\s(.*)\\s\\[check\\]\\s(.*)\\s\\[delay\\]\\s(.*)", line)[0]
                result = str(msg[0])
                reqName = str(msg[1])
                url = str(msg[2])
                check = str(msg[3])
                # From ms to seconds
                delaySecArray = str(float(msg[4]) / 1000).split(".")
                delay = delaySecArray[0] + "." + delaySecArray[1][0:3]
                if reqName not in apiChecks.keys():
                    apiChecks[reqName] = {check: {url: [result, delay]}}
                else:
                    reqNameDict = apiChecks[reqName]
                    if check not in reqNameDict.keys():
                        reqNameDict[check] = {url: [result, delay]}
                    else:
                        # NOTE! If same url is used for a given reqName and check (i.e. random test data); the result=false will be chosen (if exists), else true (cannot store both in a Dict)
                        checkDict = reqNameDict[check]
                        if url in checkDict.keys():
                            if checkDict[url][0] == "true":
                                checkDict[url] = [result, delay]
                        else:
                            checkDict[url] = [result, delay]
                        reqNameDict[check] = checkDict
                    apiChecks[reqName] = reqNameDict

    '''
    for reqName in apiChecks.keys():
        for check in apiChecks[reqName].keys():
            for url in apiChecks[reqName][check].keys():
                print("[req] {} [check] {} [url] {} [pass] {} [delay] {}".format(reqName, check, url, apiChecks[reqName][check][url][0], apiChecks[reqName][check][url][1]))
    '''

    # testsuites = createJunitManyTestsuites(apiChecks)
    testsuites = createJunit(apiChecks)

    # Write JUnit XML
    tree = ET.ElementTree(testsuites)
    tree.write(junitFile, encoding="UTF-8", xml_declaration=True)

    if os.path.isfile(junitFile):
        print('Junit file is created at "{}"'.format(junitFile))
    else:
        print('Junit file is NOT created. Something went wrong.')


# Based on format: https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/test/publish-test-results?view=azure-devops&tabs=junit%2Cyaml#result-formats-mapping
# https://junit.sourceforge.net/doc/faq/faq.htm#tests_12: Only 1 failure per testcase
def createJunit(apiChecks):
    # JUnit structure (can be duplicate testcase.names if different test data is used for same requests)
    '''
    <testsuites ...>
        <testsuite name="k6 checks" ...>
            <testcase name="reqName1: expected status" ...>
                <failure message="check failed for [req] reqName1 [check] expected status">
                    http://.../1
                </failure>
            </testcase>
            <testcase name="reqName1: correct no hits" ...>
                <failure message="check failed for [req] reqName1 [check] correct no hits">
                    http://.../2
                </failure>
            </testcase>
            <testcase name="reqName1: expected status" .../>
            <testcase name="reqName1: correct no hits" ...>
            <testcase name="reqName2: expected status" .../>
            <testcase name="reqName2: correct no hits" ...>
            ...
        </testsuite>
    </testsuites>
    '''

    # Create JUnit XML
    testsuites = ET.Element('testsuites')
    testsuite = ET.SubElement(testsuites, 'testsuite')
    testsuite.set('name', "k6 checks")
    noTests = 0
    noFailures = 0
    totDelay = 0.0

    for reqName in apiChecks.keys():
        # TODO Test the delay with more requests and more checks (both failing and not)
        delayIsAdded = False
        for check in apiChecks[reqName].keys():
            for url in apiChecks[reqName][check].keys():
                testcase = ET.SubElement(testsuite, 'testcase')
                testcase.set('name', "{}: {}".format(reqName, check))
                testcase.set('classname', "{}".format(reqName))
                testcase.set('time', "{}".format(apiChecks[reqName][check][url][1]))
                if not delayIsAdded:
                    totDelay += float(apiChecks[reqName][check][url][1])
                    delayIsAdded = True
                noTests += 1
                if apiChecks[reqName][check][url][0] == "false":
                    noFailures += 1
                    failure = ET.SubElement(testcase, 'failure')
                    failure.set('message', "check failed for [req] {} [check] {}".format(reqName, check))
                    failure.text = 'failed url: {}'.format(url)

        testsuite.set('tests', str(noTests))
        testsuite.set('failures', str(noFailures))
        testsuite.set('timestamp', str(getTimestampNow()))
        testsuite.set('time', str(totDelay))

    testsuites.set('tests', str(noTests))
    testsuites.set('failures', str(noFailures))
    testsuites.set('time', str(totDelay))

    return testsuites


# Get timestamp for now
def getTimestampNow():
    myFormat = "%Y-%m-%dT%H:%M:%S"
    return datetime.datetime.now().strftime(myFormat)


# Not used
def createJunitManyTestsuites(apiChecks):
    # JUnit structure
    '''
    <testsuites ...>
        <testsuite name="k6 check: reqName1" ...>
            <testcase name="expected status" ...>
                <failure message="http://.../1"/>
                <failure message="http://.../2"/>
            </testcase>
            <testcase name="correct no hits" ...>
                <failure message="http://.../1"/>
            </testcase>
        </testsuite>
        <testsuite name="k6 check: reqName2" ...>
            ...
        </testsuite>
    </testsuites>
    '''

    # Create JUnit XML
    testsuites = ET.Element('testsuites')
    noTestsOverall = 0
    noFailuresOverall = 0

    for reqName in apiChecks.keys():
        noTests = 0
        noFailures = 0

        testsuite = ET.SubElement(testsuites, 'testsuite')
        testsuite.set('name', "k6 checks: {}".format(reqName))
        # NOTE: Only one testcase per reqName:check independent of used for different urls (due to random test data)
        for check in apiChecks[reqName].keys():
            testcase = ET.SubElement(testsuite, 'testcase')
            testcase.set('name', check)
            testcase.set('classname', reqName)
            failureText = ""
            delay = []
            for url in apiChecks[reqName][check].keys():
                noTests += 1
                delay.append(float(apiChecks[reqName][check][url][1]))
                if apiChecks[reqName][check][url][0] == "false":
                    noFailures += 1
                    failureText += url + " \n"
            # Set failure if any
            if (len(failureText) > 0):
                failure = ET.SubElement(testcase, 'failure')
                failure.set('message', "check failed for [req] {} [check] {}".format(reqName, check))
                failure.text = 'failed url(s): \n {}'.format(failureText)
            # Set delay to max of the urls used for this check
            testcase.set('time', str(max(delay)))

        testsuite.set('tests', str(noTests))
        testsuite.set('failures', str(noFailures))
        noTestsOverall += noTests
        noFailuresOverall += noFailures

    testsuites.set('tests', str(noTestsOverall))
    testsuites.set('failures', str(noFailuresOverall))

    return testsuites


if __name__ == '__main__':
    main(sys.argv[1:])

'''
PRE
    # Working varaiables
    inputFile = "{}/{}".format(folder, file)
    junitFile = "{}/junitFromChecks.xml".format(folder)
    apiErrors = []

    # Read log file and find all [junit] log items
    with open(inputFile) as logFile:
        for line in logFile:
            if re.search("^\\[junit\\].*$", line):
                msg = str(re.findall("\\[junit\\](.*)", line)[0])
                apiErrors.append(msg)

    # Create JUnit XML
    testsuites = ET.Element('testsuites')
    testsuite = ET.SubElement(testsuites, 'testsuite')

    for msg in apiErrors:
        testcase = ET.SubElement(testsuite, 'testcase')
        testcase.set('name', str(msg))
        failure = ET.SubElement(testcase, 'failure')
        failure.set('message', 'failed')
    testsuite.set('name', "k6 failed checks")
    testsuite.set('tests', str(len(apiErrors)))
    testsuite.set('failures', str(len(apiErrors)))
    testsuites.set('tests', str(len(apiErrors)))
    testsuites.set('failures', str(len(apiErrors)))

    # Write JUnit XML
    tree = ET.ElementTree(testsuites)
    tree.write(junitFile, encoding="UTF-8", xml_declaration=True)
'''