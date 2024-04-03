import type { t } from './common';
import type { client } from './Http.client';

type O = Record<string, unknown>;

export type HttpClient = ReturnType<typeof client>;

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export type HttpOrigins = { local: string; remote: string };
export type HttpOptions = {
  origins?: Partial<HttpOrigins>;
  accessToken?: string;
  forcePublic?: boolean;
};

export type HttpResponse = {
  method: HttpMethod;
  url: string;
  ok: boolean;
  status: number;
  json: t.Json;
};

export type HttpFetcher = (
  method: t.HttpMethod,
  path: string,
  options?: { body?: O; params?: O },
) => Promise<HttpResponse>;
export type HttpFetchMethods = {
  get(path: string, params?: O): Promise<HttpResponse>;
  put(path: string, body: O, params?: O): Promise<HttpResponse>;
  post(path: string, body: O, params?: O): Promise<HttpResponse>;
  delete(path: string, params?: O): Promise<HttpResponse>;
};
