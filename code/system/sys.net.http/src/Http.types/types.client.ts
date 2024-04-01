import type { Observable, t } from './common';

/**
 * Client (HTTP)
 */
export type HttpCors = 'cors' | 'no-cors' | 'same-origin';
export type HttpCreate = (options?: HttpCreateOptions) => Http;

export type HttpCreateOptions = HttpOptions & { fetch?: t.HttpFetch };
export type HttpOptions = { headers?: t.HttpHeaders; mode?: HttpCors };

export type Http = HttpMethods & {
  create: HttpCreate;
  headers: t.HttpHeaders;
  $: Observable<t.HttpEvent>;
  req$: Observable<t.HttpMethodReq>;
  res$: Observable<t.HttpMethodRes>;
};

export type HttpMethods = {
  head(url: string, options?: HttpOptions): Promise<t.HttpResponse>;
  get(url: string, options?: HttpOptions): Promise<t.HttpResponse>;
  put(url: string, data?: any, options?: HttpOptions): Promise<t.HttpResponse>;
  post(url: string, data?: any, options?: HttpOptions): Promise<t.HttpResponse>;
  patch(url: string, data?: any, options?: HttpOptions): Promise<t.HttpResponse>;
  delete(url: string, data?: any, options?: HttpOptions): Promise<t.HttpResponse>;
};
