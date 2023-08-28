import Hapi from '@hapi/hapi';
import * as admin from 'firebase-admin';
import applicationDefault = admin.credential.applicationDefault;
import {
  PROJECT_ID,
  VIPPS_BASE64_SA,
  VIPPS_CLIENT_ID,
  VIPPS_CLIENT_SECRET,
} from '../../config/env';
import {VippsCustomTokenRequest} from '../../service/types';
import {postVippsLoginRequest} from './schema';
import {getOpenIdClientIssuer} from './openid-client-issuer';
import {logResponse} from '../../utils/log-response';
import {Timer} from '../../utils/timer';

export default (server: Hapi.Server) => () => {
  const app = admin.initializeApp({
    credential: VIPPS_BASE64_SA
      ? admin.credential.cert(VIPPS_BASE64_SA)
      : applicationDefault(),
    projectId: PROJECT_ID,
  });

  const getClient = async (callbackUrl: string) => {
    const iss = await getOpenIdClientIssuer();
    return new iss.Client({
      client_id: VIPPS_CLIENT_ID || '',
      client_secret: VIPPS_CLIENT_SECRET || '',
      redirect_uris: [callbackUrl],
      requested_flow: 'app_to_app',
      app_callback_uri: callbackUrl,
      final_redirect_is_app: true,
    });
  };

  server.route({
    method: 'GET',
    path: '/bff/login/vipps/authorization-url',
    options: {
      tags: ['api', 'authentication', 'vipps'],
      description: 'Get Vipps authorisation url',
    },
    handler: async (request) => {
      const callbackUrl = request.query.callbackUrl;
      const client = await getClient(callbackUrl);
      return client.authorizationUrl({
        scope: 'openid phoneNumber',
      });
    },
  });

  server.route({
    method: 'POST',
    path: '/bff/login/vipps/user-custom-token',
    options: {
      tags: ['api', 'authentication', 'vipps'],
      description: 'Get Vipps user custom token',
      validate: postVippsLoginRequest,
    },
    handler: async (request, h) => {
      const callbackUrl = request.query.callbackUrl;
      const client = await getClient(callbackUrl);
      const {authorizationCode, state, nonce} =
        request.payload as unknown as VippsCustomTokenRequest;
      const params = await client.callback(
        callbackUrl,
        {code: authorizationCode, state: state},
        {nonce: nonce, state: state},
      );
      if (params.access_token) {
        const vippsTimer = new Timer();
        const userInfo = await client.userinfo(params);
        const phoneNumber = userInfo.phone_number;
        logResponse({
          message: 'openid call',
          requestHeaders: h.request,
          duration: vippsTimer.getElapsedMs(),
        });
        if (phoneNumber) {
          const auth = app.auth();
          try {
            const authTimer = new Timer();
            const user = await auth.getUserByPhoneNumber(`+${phoneNumber}`);
            logResponse({
              message: 'firebase call',
              requestHeaders: h.request,
              duration: authTimer.getElapsedMs(),
              customerAccountId: user.uid,
            });
            return await auth.createCustomToken(user.uid);
          } catch (error: any) {
            if (error && error.code && error.code === 'auth/user-not-found') {
              const user = await auth.createUser({
                phoneNumber: `+${phoneNumber}`,
              });
              return await auth.createCustomToken(user.uid);
            }
            throw error;
          }
        }
      }
    },
  });
};
