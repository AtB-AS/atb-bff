import Hapi from '@hapi/hapi';
import {v4 as uuid} from 'uuid';

interface Options {}

const plugin: Hapi.Plugin<Options> = {
  name: 'atb-headers',
  register: (server, _) => {
    const installId = (request: Hapi.Request) =>
      request.headers['atb-install-id'];
    const requestId = (request: Hapi.Request) =>
      request.headers['atb-request-id'];
    const appVersion = (request: Hapi.Request) =>
      request.headers['atb-app-version'];
    const webshopVersion = (request: Hapi.Request) =>
      request.headers['atb-webshop-version'];
    const correlationId = (request: Hapi.Request) =>
      request.headers['atb-correlation-id'] || uuid();
    const customerAccountId = (request: Hapi.Request) =>
      request.headers['entur-customer-account-id'];
    const tlsVersion = (request: Hapi.Request) =>
      request.headers['tls-version'];
    server.decorate('request', 'installId', installId, {apply: true});
    server.decorate('request', 'requestId', requestId, {apply: true});
    server.decorate('request', 'appVersion', appVersion, {apply: true});
    server.decorate('request', 'webshopVersion', webshopVersion, {apply: true});
    server.decorate('request', 'correlationId', correlationId, {apply: true});
    server.decorate('request', 'customerAccountId', customerAccountId, {
      apply: true,
    });
    server.decorate('request', 'tlsVersion', tlsVersion, {apply: true});
  },
};

export default plugin;
