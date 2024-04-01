import { Subject } from 'rxjs';

import { rx, type t } from '../common';
import { fetch } from './fetch';
import { fetcher } from './Http.fetcher';

export const create: t.HttpCreate = (options = {}) => {
  const mergeOptions = (methodOptions: t.HttpOptions = {}) => {
    const args = {
      ...options,
      ...methodOptions,
      headers: { ...options.headers, ...methodOptions.headers },
    };
    const { mode = 'cors', headers } = args;
    return { mode, headers };
  };

  const invoke = (
    method: t.HttpMethod,
    args: { url: string; data?: any; options?: t.HttpOptions },
  ) => {
    const { mode, headers } = mergeOptions(args.options);
    const { url, data } = args;
    return fetcher({ method, url, mode, headers, data, fire, fetch: options.fetch || fetch });
  };

  const $ = new Subject<t.HttpEvent>();
  const fire: t.FireEvent = (e) => $.next(e);

  const http: t.Http = {
    create(options: t.HttpCreateOptions = {}) {
      const headers = { ...http.headers, ...options.headers };
      return create({ ...options, headers });
    },

    $: $.asObservable(),
    req$: rx.payload<t.HttpMethodReqEvent>($, 'HTTP/method:req'),
    res$: rx.payload<t.HttpMethodResEvent>($, 'HTTP/method:res'),

    get headers() {
      return { ...options.headers };
    },

    /**
     * HEAD
     */
    async head(url: string, options: t.HttpOptions = {}): Promise<t.HttpResponse> {
      return invoke('HEAD', { url, options });
    },

    /**
     * GET
     */
    async get(url: string, options: t.HttpOptions = {}): Promise<t.HttpResponse> {
      return invoke('GET', { url, options });
    },

    /**
     * PUT
     */
    async put(url: string, data?: any, options: t.HttpOptions = {}): Promise<t.HttpResponse> {
      return invoke('PUT', { url, data, options });
    },

    /**
     * POST
     */
    async post(url: string, data?: any, options: t.HttpOptions = {}): Promise<t.HttpResponse> {
      return invoke('POST', { url, data, options });
    },

    /**
     * PATCH
     */
    async patch(url: string, data?: any, options: t.HttpOptions = {}): Promise<t.HttpResponse> {
      return invoke('PATCH', { url, data, options });
    },

    /**
     * DELETE
     */
    async delete(url: string, data?: any, options: t.HttpOptions = {}): Promise<t.HttpResponse> {
      return invoke('DELETE', { url, data, options });
    },
  };

  return http;
};
