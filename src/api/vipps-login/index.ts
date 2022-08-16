import Hapi from "@hapi/hapi";
import {Issuer} from "openid-client";
import {credential, initializeApp} from "firebase-admin";
import applicationDefault = credential.applicationDefault;
import {PROJECT_ID, VIPPS_BASE_URL, VIPPS_CALLBACK_URL, VIPPS_CLIENT_ID, VIPPS_CLIENT_SECRET} from "../../config/env";
import {VippsCustomTokenRequest} from "../../service/types";
import {postVippsLoginRequest} from "./schema";

export default (server: Hapi.Server) => () => {

    const app = initializeApp({
        credential: applicationDefault(),
        projectId: PROJECT_ID
    })

    const getClient = async () => {
        const iss = await Issuer.discover(VIPPS_BASE_URL + '/access-management-1.0/access/');
        return new iss.Client({
            client_id: VIPPS_CLIENT_ID || '',
            client_secret: VIPPS_CLIENT_SECRET || '',
            redirect_uris: [VIPPS_CALLBACK_URL || ''],
            requested_flow: 'app_to_app',
            app_callback_uri: VIPPS_CALLBACK_URL,
        });
    }

    server.route({
        method: 'GET',
        path: '/bff/login/vipps/authorization-url',
        options: {
            description: 'Get Vipps authorisation url',
        },
        handler: async () => {
            const client = await getClient();
            return client.authorizationUrl({
                scope: 'openid phoneNumber',
            })
        }
    });

    server.route({
        method: 'POST',
        path: '/bff/login/vipps/user-custom-token',
        options: {
            description: 'Get Vipps user custom token',
            validate: postVippsLoginRequest
        },
        handler: async (request,) => {
            const client = await getClient();
            const {authorizationCode, state, nonce} = (request.payload as unknown) as VippsCustomTokenRequest;
            const params = await client.callback(VIPPS_CALLBACK_URL,
                {code: authorizationCode, state: state},
                {nonce: nonce, state: state}
            )
            if (params.access_token) {
                const userInfo = await client.userinfo(params)
                const phoneNumber = userInfo.phone_number;
                if (phoneNumber) {
                    const auth = app.auth();
                    try {
                        const user = await auth.getUserByPhoneNumber(`+${phoneNumber}`)
                        return await auth.createCustomToken(user.uid);
                    } catch (error: any) {
                        if (error && error.code && error.code === 'auth/user-not-found') {
                            const user = await auth.createUser({phoneNumber});
                            return await auth.createCustomToken(user.uid);
                        }
                        throw error;
                    }
                }
            }
        }
    });
};