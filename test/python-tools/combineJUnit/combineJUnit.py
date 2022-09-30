import getopt
import sys
import os
import xml.etree.ElementTree as ET

'''
# Combines one or more JUnit XML files into one JUnit XML

# Start
$ combineJUnit.py --files <list of JUnit xml files separated with ","> --folder <folder for input files and combined JUnit xml>
    -> files: files + extension separated by ','
    -> folder: path (relative is OK)

# Example
$ python3 python-tools/combineJUnit/combineJUnit.py --files junit_1.xml,junit_2.xml --folder api-tests/src/main/k6/results

# Output as JUnit xml
-> {folder}/combinedJUnit.xml
'''


def main(argv):
    # Init parameters
    files = []
    folder = ''
    abs1 = False
    abs2 = False

    # Input parameters
    try:
        opts, args = getopt.getopt(argv, "", ["files=", "folder="])
    except getopt.GetoptError:
        print('combineJUnit.py --files <list of JUnit xml files separated with ","> --folder <folder for input files and combined JUnit xml>')
        sys.exit()
    for opt, arg in opts:
        if opt == '--files':
            for file in str(arg).split(","):
                files.append(file)
            abs1 = True
        elif opt == '--folder':
            folder = arg
            abs2 = True
    # Check that the non optional parameters are set
    if not abs1 or not abs2:
        print('Missing "--files" and/or "--folder" parameter')
        print('combineJUnit.py --files <list of JUnit xml files separated with ","> --folder <folder for input files and combined JUnit xml>')
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

    # Parse XML input files
    for file in files:
        treeIn = ET.parse('{}/{}'.format(folder, file))
        testsuites = treeIn.getroot()
        for testsuite in testsuites:
            tests += int(testsuite.get('tests'))
            failures += int(testsuite.get('failures'))
            testsuitesOut.append(testsuite)
    testsuitesOut.set('tests', str(tests))
    testsuitesOut.set('failures', str(failures))

    # Write combined XML
    treeOut = ET.ElementTree(testsuitesOut)
    treeOut.write(outFile, encoding="UTF-8", xml_declaration=True)

    if os.path.isfile(outFile):
        print('Combined Junit file is created at "{}"'.format(outFile))
    else:
        print('Combined Junit file is NOT created. Something went wrong.')


if __name__ == '__main__':
    main(sys.argv[1:])
