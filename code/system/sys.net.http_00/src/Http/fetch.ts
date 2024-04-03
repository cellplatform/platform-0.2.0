import { Util, type t } from '../common';

export const httpFetch: t.HttpFetch = async (req) => {
  const { url, method, mode, data } = req;

  const onError = () =>
    `Failed to ${method} to '${url}'. The data could not be serialized to JSON.`;

  const toBody = (): any => {
    if (data instanceof Uint8Array) return data;
    if (Util.isFormData(req.headers)) return data;
    if (typeof data === 'string') return data;
    return Util.stringify(data, onError);
  };

  const headers = Util.toRawHeaders(req.headers);
  const body = ['GET', 'HEAD'].includes(method) ? undefined : toBody();

  return fetch(url, { method, mode, body, headers });
};
