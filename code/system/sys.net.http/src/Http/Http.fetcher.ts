import { Delete, Headers, Time, Util, slug, type t } from '../common';

export const fetcher = async (args: {
  url: string;
  method: t.HttpMethod;
  fire: t.FireEvent;
  mode: t.HttpCors;
  headers: t.HttpHeaders;
  fetch: t.HttpFetch;
  data?: any;
}) => {
  // Prepare arguments.
  const timer = Time.timer();
  const tx = `request-${slug()}`;
  const { url, method, data, fire, mode } = args;

  type M = { headers?: t.HttpHeaders; data?: any; respond?: t.HttpRespondInput };
  const modifications: M = {
    headers: args.headers || {},
    data: undefined,
    respond: undefined,
  };

  const modify: t.HttpModify = {
    header(key: string, value: string) {
      before.isModified = true;
      const headers = modifications.headers || {};
      if (value) {
        headers[key] = value;
      } else {
        delete headers[key];
      }
      modifications.headers = headers;
    },
    headers: {
      merge(input: t.HttpHeaders) {
        before.isModified = true;
        modifications.headers = Delete.empty({ ...modifications.headers, ...input });
      },
      replace(input: t.HttpHeaders) {
        before.isModified = true;
        modifications.headers = Delete.empty(input);
      },
    },
  };

  // Fire BEFORE event.
  const before: t.HttpMethodReq = {
    tx,
    method,
    url,
    data,
    headers: args.headers,
    isModified: false,
    modify,
    respond(input) {
      modifications.respond = input;
    },
  };
  fire({ type: 'HTTP/method:req', payload: before });

  if (modifications.respond) {
    // Exit with faked/overridden response if one was returned via the BEFORE event.
    const respond = modifications.respond;
    const payload = typeof respond === 'function' ? await respond() : respond;
    const response = await Util.response.fromPayload(payload, modifications);
    const elapsed = timer.elapsed.msec;
    const { ok, status } = response;
    fire({
      type: 'HTTP/method:res',
      payload: { tx, method, url, ok, status, response, elapsed },
    });
    return response;
  } else {
    const done = async (fetched: t.HttpFetchResponse) => {
      const response = await Util.response.fromFetch(fetched);
      const elapsed = timer.elapsed.msec;
      const { ok, status } = response;
      fire({
        type: 'HTTP/method:res',
        payload: { tx, method, url, ok, status, response, elapsed },
      });
      return response;
    };

    const headers = modifications.headers || args.headers;
    try {
      // Invoke the HTTP service end-point.
      const fetched = await args.fetch({ url, mode, method, headers, data });
      return done(fetched);
    } catch (error: any) {
      /**
       * HTTP Status: 0 ("error happened prior to the server being contacted").
       * Ref: https://stackoverflow.com/questions/872206/what-does-it-mean-when-an-http-request-returns-status-code-0#14507670
       */
      const statusText = (error.message as string).replace(/^TypeError:/, '').trim();
      const fetched: t.HttpFetchResponse = {
        status: 0,
        statusText,
        headers: new Headers(headers),
        body: null,
        text: async () => '',
        json: async () => null,
      };
      return done(fetched);
    }
  }
};
