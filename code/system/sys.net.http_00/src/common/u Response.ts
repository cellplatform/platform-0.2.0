import type * as t from './t';

import { Mime } from './libs';
import { fromRawHeaders, headerValue, isStream, stringify, toRawHeaders } from './u.helpers';

export const Response = {
  /**
   * Convert a [HttpRespondPayload] fetch result to a proper [HttpResponse] object.
   */
  async fromPayload(
    payload: t.HttpRespondPayload,
    modifications: { data?: any; headers?: t.HttpHeaders } = {},
  ) {
    const { status, statusText = '' } = payload;
    const data = payload.data || modifications.data;

    let head = payload.headers || modifications.headers || {};
    if (data && !headerValue('content-type', head)) {
      head = {
        ...head,
        'content-type': isStream(data) ? 'application/octet-stream' : 'application/json',
      };
    }

    const contentType = headerValue('content-type', head);
    const isBinary = Mime.isBinary(contentType);

    const toText = (data: any) => {
      if (!data) return '';
      if (typeof data === 'string') return data;
      return stringify(data, () => `Failed while serializing data to JSON within [text] method.`);
    };

    const toJson = (data: any) => {
      return data && !isBinary ? data : '';
    };

    let text = '';
    let json = '';

    const res: t.HttpFetchResponse = {
      status,
      statusText,
      headers: toRawHeaders(head),
      body: isBinary ? data : null,
      async text() {
        return text || (text = toText(data));
      },
      async json() {
        return json || (json = toJson(data));
      },
    };

    return Response.fromFetch(res);
  },

  /**
   * Convert a "response like" fetch result to a proper [HttpResponse] object.
   */
  async fromFetch(res: t.HttpFetchResponse) {
    const { status } = res;
    const ok = status.toString()[0] === '2';
    const body = res.body || undefined;
    const statusText = res.statusText ? res.statusText : ok ? 'OK' : '';

    const headers = fromRawHeaders(res.headers);
    const contentType = Response.toContentType(headers);
    const text = contentType.is.text ? await res.text() : '';
    const json = contentType.is.json ? await res.json() : '';

    const result: t.HttpResponse = {
      ok,
      status,
      statusText,
      headers,
      contentType,
      body,
      text,
      json,
    };

    return result;
  },

  /**
   * Derives content-type details from the given headers.
   */
  toContentType(headers: t.HttpHeaders): t.HttpContentType {
    const mime = headerValue('content-type', headers);
    const res: t.HttpContentType = {
      mime,
      is: {
        get json() {
          return Mime.isJson(mime);
        },
        get text() {
          return Mime.isText(mime);
        },
        get binary() {
          return Mime.isBinary(mime);
        },
      },
      toString() {
        return mime;
      },
    };
    return res;
  },
} as const;
