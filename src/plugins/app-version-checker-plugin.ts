import Hapi from '@hapi/hapi';
import {compareVersion} from '../utils/compare-version';

interface Options {}

const plugin: Hapi.Plugin<Options> = {
  dependencies: 'atb-headers',
  name: 'app-version-checker-plugin',
  register: (server) => {
    server.ext('onPreHandler', (request, h) => {
      const minAppVersion = process.env.MIN_APP_VERSION;
      if (isAppVersionTooLow(request.appVersion, minAppVersion)) {
        return h
          .response({error: `Required client app version: ${minAppVersion}`})
          .code(426)
          .takeover();
      }

      return h.continue;
    });
  },
};

const isAppVersionTooLow = (
  appVersion: string | undefined,
  minAppVersion: string | undefined,
): boolean => {
  if (!appVersion) return false;
  if (!minAppVersion) return false;
  return compareVersion(minAppVersion, appVersion) > 0;
};

export default plugin;
