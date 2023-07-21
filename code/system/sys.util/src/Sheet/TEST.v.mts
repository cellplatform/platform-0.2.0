import { describe, it, expect, type t } from '../test';
import { Sheet, Cell } from '.';
import { SheetCell } from './Sheet.Cell.mjs';

describe.only('Sheet', () => {
  it('exports', () => {
    expect(Sheet.Cell).to.equal(Cell);
    expect(Sheet.Cell).to.equal(SheetCell);
  });

  describe('Sheet.Cell', () => {
    describe('address (A1..Z9)', () => {
      it('throw: x,y less than zero', () => {
        expect(() => Cell.address(-1, 0)).to.throw(/x is less than 0 \(-1\)/);
        expect(() => Cell.address(0, -1)).to.throw(/y is less than 0 \(-1\)/);
      });

      it('A1..Z9', () => {
        const test = (x: number, y: number, expected: t.CellAddress) => {
          const res = Cell.address(x, y);
          expect(res).to.eql(expected);
        };
        test(0, 0, 'A1');
      });
    });
  });
});
