import { t } from '../common/index.mjs';

export const Json = {
  stringify(input: t.Json) {
    return `${JSON.stringify(input, null, '  ')}\n`;
  },
};
