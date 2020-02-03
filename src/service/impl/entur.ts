import createService from '@entur/sdk';

const service = createService({
  clientName: process.env.CLIENT_NAME || 'atb-mittatb'
});

export default service;
