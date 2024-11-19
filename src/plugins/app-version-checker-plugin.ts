import Hapi from '@hapi/hapi';
import {compareVersion} from '../utils/compare-version';

interface Options {}

const plugin: Hapi.Plugin<Options> = {
  dependencies: 'atb-headers',
  name: 'app-version-checker-plugin',
  register: (server) => {
    server.ext('onPreHandler', (request, h) => {
      const isHealthEndpoint = request.route.settings.tags?.includes('health');
      if (isHealthEndpoint) return h.continue;

      const minAppVersion = process.env.MIN_APP_VERSION;
      if (isAppVersionTooLow(request, minAppVersion)) {
        return h
          .response({error: `Required client app version: ${minAppVersion}`})
          .code(406)
          .takeover();
      }

      return h.continue;
    });
  },
};

const isAppVersionTooLow = (
  request: Hapi.Request,
  minAppVersion: string | undefined,
): boolean => {
  const isRequestFromWebshop = !!request.webshopVersion;
  if (isRequestFromWebshop) return false;
  if (!minAppVersion) return false;
  if (!request.appVersion) return false;
  return compareVersion(minAppVersion, request.appVersion) > 0;
};

export default plugin;
