import { describe, expect, it } from '../../test';
import { type t } from '../common';
import { TimeMap } from './TimeMap.mjs';

describe('TimeMap', () => {
  describe('sorting', () => {
    it('sortedMedia: no change in order', () => {
      const list: t.DocDiagramMedia[] = [
        { start: 0, end: 7, image: 'foo' },
        { start: 10, markdown: '# Hello' },
        { start: 15, end: null, image: 'bar' },
      ];

      const res = TimeMap.sortedMedia(list);
      expect(res.length).to.eql(3);

      expect(res[0].indexRef).to.eql(0);
      expect(res[1].indexRef).to.eql(1);
      expect(res[2].indexRef).to.eql(2);

      expect(res[0].kind).to.eql('media.image');
      expect(res[1].kind).to.eql('media.markdown');
      expect(res[2].kind).to.eql('media.image');
    });

    it('sortedMedia: change in order with original order detail retained (indexRef)', () => {
      const list: t.DocDiagramMedia[] = [
        { title: 'A', image: 'foo', start: 15 },
        { title: 'B', markdown: '# Hello', start: 0 },
      ];

      const res = TimeMap.sortedMedia(list);

      expect(res.length).to.eql(2);
      expect(res[0].indexRef).to.eql(1); // NB: Out of order compared wtih original input list.
      expect(res[1].indexRef).to.eql(0);

      expect(res[0].kind).to.eql('media.markdown');
      expect(res[1].kind).to.eql('media.image');
    });

    it('sortedTimeMap', () => {
      const list: (t.DocTimeWindow & { foo: number })[] = [
        { foo: 1, start: 15 },
        { foo: 2, start: 0 },
      ];

      const res = TimeMap.sortedTimeMap(list);

      expect(res.length).to.eql(2);
      expect(res[0].start).to.eql(0); // NB: Out of order compared wtih original input list.
      expect(res[1].start).to.eql(15);
    });
  });

  describe('current', () => {
    it('match', () => {
      const list: t.DocDiagramMedia[] = [
        { start: 0, end: 7, image: 'foo' },
        { start: 10, markdown: '# Hello' },
        { start: 15, end: null, image: 'bar' },
      ];

      const res1 = TimeMap.current(list, 5);
      const res2 = TimeMap.current(list, 6.9999);
      const res3 = TimeMap.current(list, 7);
      const res4 = TimeMap.current(list, 9);
      const res5 = TimeMap.current(list, 10);
      const res6 = TimeMap.current(list, 15);
      const res7 = TimeMap.current(list, 9999); // Still a match - no end.

      expect(res1?.indexRef).to.eql(0);
      expect(res2?.indexRef).to.eql(0);
      expect(res3).to.eql(undefined); // NB: Ends at 7s.
      expect(res4).to.eql(undefined); // NB: Ended at 7s and next item not yet started.
      expect(res5?.indexRef).to.eql(1);
      expect(res6?.indexRef).to.eql(2);
      expect(res7?.indexRef).to.eql(2);
    });
  });
});
