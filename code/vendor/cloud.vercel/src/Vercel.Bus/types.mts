import * as t from '../common/types.mjs';

type Id = string;
type Milliseconds = number;
type IdOrName = string;
type Name = string;

export type VercelInfo = {
  /**
   * https://vercel.com/docs/api#endpoints
   */
  endpoint: {
    alive: boolean;
    user?: t.VercelHttpUser;
    error?: t.VercelHttpError;
  };
};

/**
 * EVENTS
 */

export type VercelEvent =
  | VercelInfoReqEvent
  | VercelInfoResEvent
  | VercelDeployReqEvent
  | VercelDeployResEvent;

/**
 * Event API
 */
export type VercelEvents = t.Disposable & {
  instance: { bus: Id; id: Id };
  $: t.Observable<t.VercelEvent>;
  is: { base(input: any): boolean };

  info: {
    req$: t.Observable<t.VercelInfoReq>;
    res$: t.Observable<t.VercelInfoRes>;
    get(options?: { timeout?: Milliseconds }): Promise<VercelInfoRes>;
  };

  deploy: {
    req$: t.Observable<t.VercelDeployReq>;
    res$: t.Observable<t.VercelDeployRes>;
    fire(args: {
      source: t.VercelSourceBundle;
      team: IdOrName;
      project: Name;
      timeout?: Milliseconds;

      /**
       * Vercel configuration options.
       * https://vercel.com/docs/rest-api#endpoints/deployments/create-a-new-deployment
       */
      name?: t.VercelHttpDeployConfig['name'];
      env?: t.VercelHttpDeployConfig['env'];
      buildEnv?: t.VercelHttpDeployConfig['buildEnv'];
      functions?: t.VercelHttpDeployConfig['functions'];
      regions?: t.VercelHttpDeployConfig['regions'];
      routes?: t.VercelHttpDeployConfig['routes'];
      public?: t.VercelHttpDeployConfig['public'];
      target?: t.VercelHttpDeployConfig['target'];
      alias?: t.VercelHttpDeployConfig['alias'];
    }): Promise<VercelDeployRes>;
  };
};

/**
 * Module info.
 */
export type VercelInfoReqEvent = {
  type: 'vendor.vercel/info:req';
  payload: VercelInfoReq;
};
export type VercelInfoReq = { tx: string; instance: Id };

export type VercelInfoResEvent = {
  type: 'vendor.vercel/info:res';
  payload: VercelInfoRes;
};
export type VercelInfoRes = { tx: string; instance: Id; info?: VercelInfo; error?: string };

/**
 * Deploy
 */
export type VercelDeployReqEvent = {
  type: 'vendor.vercel/deploy:req';
  payload: VercelDeployReq;
};
export type VercelDeployReq = {
  tx: string;
  instance: Id;
  team: IdOrName;
  project: Name;
  source: t.VercelSourceBundle;
  config?: t.VercelHttpDeployConfig;
};

export type VercelDeployResEvent = {
  type: 'vendor.vercel/deploy:res';
  payload: VercelDeployRes;
};
export type VercelDeployRes = {
  tx: string;
  instance: Id;
  paths: string[];
  deployment?: t.VercelHttpDeployResponse['deployment'];
  error?: string;
};
