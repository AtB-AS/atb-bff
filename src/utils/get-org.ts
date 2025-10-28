import {Org} from '../service/types';
import {ORG_ID} from '../config/env';

export function getOrg(): Org | undefined {
  return Object.values(Org).includes(ORG_ID as Org)
    ? (ORG_ID as Org)
    : undefined;
}
