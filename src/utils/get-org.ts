import {Orgs} from '../service/types';
import {ORG_ID} from "../config/env";

export function getOrg(): Orgs | undefined {
  switch (ORG_ID) {
    case 'atb':
      return Orgs.atb;
    case 'fram':
      return Orgs.fram;
    case 'nfk':
      return Orgs.nfk;
    case 'troms':
      return Orgs.troms;
  }
}
