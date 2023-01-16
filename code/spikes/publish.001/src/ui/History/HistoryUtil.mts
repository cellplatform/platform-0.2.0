import { type t } from '../common';

export const HistoryUtil = {
  /**
   * Ensure a unique list of semvers (taking the items with the latest timestamp)
   */
  format(data?: t.LogPublicHistory) {
    const version = data?.latest.version || '0.0.0';
    const history = (data?.history || []).filter((item) => item.version !== version);
    return {
      latest: { version },
      history,
    };
  },
};
