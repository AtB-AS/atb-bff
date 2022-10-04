import getopt
import sys
import os
import xml.etree.ElementTree as ET

'''
# Combines one or more JUnit XML files into one JUnit XML

# Note: If one JUnit misses the 'time' and 'timestamp' attributes, the option '--addTime true' can be added. 
This is the case for combining the checks-JUnit and thresholds-JUnit from k6, where the thresholds-JUnit misses these
fields (would be equal to the times of checks-JUnit).

# Start
$ combineJUnit.py --files <list of JUnit xml files separated with ","> --folder <folder for input files and combined JUnit xml> --addTime [OPT] <add time and timestamp on testsuites if missing>'
    -> files: files + extension separated by ','
    -> folder: path (relative is OK)
    -> addTime: Optional [true | false]

# Example
$ python3 python-tools/combineJUnit/combineJUnit.py --files junit_1.xml,junit_2.xml --folder api-tests/src/main/k6/results --addTime true

# Output as JUnit xml
-> {folder}/combinedJUnit.xml
'''


def main(argv):
    # Init parameters
    files = []
    folder = ''
    addMissingTimeAttributes = False
    abs1 = False
    abs2 = False

    # Input parameters
    try:
        opts, args = getopt.getopt(argv, "", ["files=", "folder=", "addTime="])
    except getopt.GetoptError:
        print('combineJUnit.py --files <list of JUnit xml files separated with ","> --folder <folder for input files and combined JUnit xml> --addTime [OPT] <add time and timestamp on testsuites if missing>')
        sys.exit()
    for opt, arg in opts:
        if opt == '--files':
            for file in str(arg).split(","):
                files.append(file)
            abs1 = True
        elif opt == '--folder':
            folder = arg
            abs2 = True
        elif opt == '--addTime':
            if arg == 'true':
                addMissingTimeAttributes = True
    # Check that the non optional parameters are set
    if not abs1 or not abs2:
        print('Missing "--files" and/or "--folder" parameter')
        print('combineJUnit.py --files <list of JUnit xml files separated with ","> --folder <folder for input files and combined JUnit xml> --addTime [OPT] <add time and timestamp on testsuites if missing>')
        sys.exit()
    # Check that files exist
    for file in files:
        if not os.path.isfile(folder + "/" + file):
            print("File {} does not exist. Exiting...".format(folder + "/" + file))
            sys.exit()

    # XML output
    testsuitesOut = ET.Element('testsuites')
    outFile = "{}/combinedJUnit.xml".format(folder)
    failures = 0
    tests = 0
    delay = 0.0
    timestamp = ''

    # Parse XML input files
    for file in files:
        treeIn = ET.parse('{}/{}'.format(folder, file))
        testsuites = treeIn.getroot()
        for testsuite in testsuites:
            tests += int(testsuite.get('tests'))
            failures += int(testsuite.get('failures'))
            if testsuite.get('time'):
                delay += float(testsuite.get('time'))
            if testsuite.get('timestamp'):
                timestamp = testsuite.get('timestamp')
            testsuitesOut.append(testsuite)
    testsuitesOut.set('tests', str(tests))
    testsuitesOut.set('failures', str(failures))
    if addMissingTimeAttributes:
        testsuitesOut.set('time', str(delay))

    # Write combined XML
    if addMissingTimeAttributes:
        treeOut = ET.ElementTree(addTimeAttribute(testsuitesOut, delay, timestamp))
    else:
        treeOut = ET.ElementTree(testsuitesOut)
    treeOut.write(outFile, encoding="UTF-8", xml_declaration=True)

    if os.path.isfile(outFile):
        print('Combined Junit file is created at "{}"'.format(outFile))
    else:
        print('Combined Junit file is NOT created. Something went wrong.')


def addTimeAttribute(testsuites:ET.Element, delay: float, timestamp: str):
    tsWithTime = ET.Element('testsuites')
    for ts in testsuites:
        if not ts.get('time'):
            ts.set('time', str(delay))
        if not ts.get('timestamp'):
            ts.set('timestamp', timestamp)
        for tc in ts:
            if not tc.get('time'):
                tc.set('time', str(delay))
        tsWithTime.append(ts)

    return tsWithTime


if __name__ == '__main__':
    main(sys.argv[1:])
