declare module 'hapi-pulse' {
  import { Plugin } from '@hapi/hapi';
  interface Logger {
    error(message: string): void;
  }

  type Signals = 'SIGINT' | 'SIGTERM';
  namespace HapiPulse {
    interface Options {
      logger?: Logger;
      signals?: Signals[];
      preServerStop?: () => Promise<void>;
      postServerStop?: () => Promise<void>;
      preShutdown?: () => Promise<void>;
      timeout?: number;
    }
  }
  var HapiPulse: Plugin<HapiPulse.Options>;

  export = HapiPulse;
}

declare module 'hapi-api-version' {
  import { Plugin } from '@hapi/hapi';

  namespace HapiApiVersion {
    interface Options {
      validVersions: number[];
      defaultVersion: number;
      vendorName: string;
      versionHeader?: string;
      passiveMode?: boolean;
      basePath?: string;
    }
  }

  var HapiApiVersion: Plugin<HapiApiVersion.Options>;

  export = HapiApiVersion;
}
