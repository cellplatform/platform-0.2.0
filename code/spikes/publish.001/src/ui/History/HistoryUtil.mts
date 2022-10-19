import { t, R } from '../common.mjs';

export const HistoryUtil = {
  /**
   * Ensure a unique list of semvers (taking the items with the latest timestamp)
   */
  format(data?: t.PublicLogSummary) {
    /**
     * TODO 🐷
     * - Move this logic into the creation of [log.public.json] during deployment
     */
    const history = data?.history || [];
    const byVersion = R.groupBy((item: t.PublicLogHistoryItem) => item.version);
    const grouped = byVersion(history);
    return Object.keys(grouped).map((version) => grouped[version][0]);
  },
};
