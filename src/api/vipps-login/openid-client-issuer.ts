import { Issuer } from 'openid-client';
import { VIPPS_BASE_URL } from '../../config/env';

let openIdClientIssuer: Issuer;

export async function getOpenIdClientIssuer() {
  if (openIdClientIssuer) {
    return openIdClientIssuer;
  }
  openIdClientIssuer = await Issuer.discover(
    VIPPS_BASE_URL + '/access-management-1.0/access/'
  );
  return openIdClientIssuer;
}
