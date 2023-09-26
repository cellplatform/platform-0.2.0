import type { t } from '../common.t';

export type Is = IsFlags & IsMethods;

export type IsFlags = {
  env: {
    browser: boolean;
    nodejs: boolean;
  };
};

export type IsMethods = {
  stream(input?: any): boolean;
  observable<T = any>(input?: any): input is t.Observable<T>;
  subject<T = any>(input?: any): input is t.Subject<T>;
  promise<T = any>(input?: any): input is Promise<T>;
  plainObject(input?: any): boolean;
  blank(input?: any): boolean;
  numeric(input?: any): boolean;
  json(input?: any): boolean;
  email(input?: any): boolean;
  url(input?: any): boolean;
  statusOK(input?: any): boolean;
  http(input: string, forceHttps?: boolean): boolean;
};
