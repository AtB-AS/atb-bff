import createService from '@entur/sdk';

export default createService({
  clientName: process.env.CLIENT_NAME || 'atb-mittatb'
});
