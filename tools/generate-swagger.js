const yaml = require('yaml');
const fetch = require('node-fetch');
const { spawn } = require('child_process');
const fs = require('fs');
const { join } = require('path');

const { readFile, writeFile } = fs.promises;

const PORT = '1337';
const URL = `http://localhost:${PORT}/swagger.json`;

const TIMEOUT = 10 * 1000;

const swaggerFile = join(process.cwd(), 'swagger.yaml');

if (!fs.existsSync(swaggerFile)) {
  console.error(`Could not find existing swagger file at ${swaggerFile}`);
  process.exit(-1);
}

function startServer() {
  return new Promise(function (res, rej) {
    const server = spawn(`npm`, ['run', 'start:dev'], {
      env: { ...process.env, PORT }
    });

    server.stdout.on('data', data => {
      if (data.includes('[STARTED]')) {
        res(() => server.kill());
      }
    });

    const timeoutId = setTimeout(function () {
      console.error('Timed out. Stopping subprocess');
      server.kill();
      rej(new Error('TIMEOUT'));
    }, TIMEOUT);

    server.on('close', code => {
      clearTimeout(timeoutId);
      if (code !== 0) {
        rej(new Error('STATUS ' + code));
      }
    });
  });
}

async function getNewSwaggerYamlFromLocalhost() {
  const result = await fetch(URL);
  const data = await result.json();
  const { paths, definitions } = data;
  return yaml.stringify({ paths, definitions });
}

async function getExistingSwaggerHeader() {
  const existingSource = (await readFile(swaggerFile)).toString('utf-8');
  const { paths: _1, definitions: _2, ...rest } = yaml.parse(existingSource);
  return yaml.stringify(rest);
}

async function getSwaggerAsYaml() {
  let status = 0;
  let stopServer;
  try {
    const yamlYeader = getExistingSwaggerHeader();
    stopServer = await startServer();
    const newPathsAndDefinitions = await getNewSwaggerYamlFromLocalhost();

    const newYaml = (await yamlYeader) + newPathsAndDefinitions;

    await writeFile(swaggerFile, newYaml);

    console.log('---------------------------');
    console.log(
      'Wrote new swagger.json, stage and commit for CI to detect new end points'
    );
    console.log('Remember to check the git diff as quality assurance.');
    console.log('---------------------------');
  } catch (e) {
    status = -1;
    console.error('Unable to generate swagger data');
    console.error(e);
  } finally {
    stopServer?.();
    process.exit(status);
  }
}

getSwaggerAsYaml();
