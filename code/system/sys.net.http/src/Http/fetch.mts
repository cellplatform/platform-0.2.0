import { t, util, CrossFetch } from '../common/index.mjs';

export const fetch: t.HttpFetch = async (req) => {
  const { url, method, mode, data } = req;

  const onError = () =>
    `Failed to ${method} to '${url}'. The data could not be serialized to JSON.`;

  const toBody = (): any => {
    if (data instanceof Uint8Array) return data;
    if (util.isFormData(req.headers)) return data;
    if (typeof data === 'string') return data;
    return util.stringify(data, onError);
  };

  const headers = util.toRawHeaders(req.headers);
  const body = ['GET', 'HEAD'].includes(method) ? undefined : toBody();

  return CrossFetch(url, { method, mode, body, headers });
};
