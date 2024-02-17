import type { t } from './common';

type O = Record<string, unknown>;

export type HttpMethod = 'GET' | 'POST' | 'DELETE';
export type HttpOrigins = { local: string; remote: string };
export type HttpOptions = { forcePublic?: boolean; origins?: Partial<HttpOrigins> };

export type HttpResponse = {
  ok: boolean;
  status: number;
  method: HttpMethod;
  url: string;
  json: t.Json;
};

export type HttpFetcher = (
  method: t.HttpMethod,
  path: string,
  options?: { body?: O; params?: O },
) => Promise<HttpResponse>;
export type HttpFetchMethods = {
  get(path: string, params?: O): Promise<HttpResponse>;
  post(path: string, body: O, params?: O): Promise<HttpResponse>;
  delete(path: string, params?: O): Promise<HttpResponse>;
};
