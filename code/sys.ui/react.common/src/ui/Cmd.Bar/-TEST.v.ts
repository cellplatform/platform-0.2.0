import { Time, describe, it, expect, type t, Immutable } from '../../test';
import { CmdBar } from '.';

describe('CmdBar', () => {
  describe('CmdBar.Ctrl', () => {
    it('creation (from simple Immutable<T>)', async () => {
      const transport = Immutable.clonerRef({});
      const ctrl1 = CmdBar.Ctrl.create(transport);
      const ctrl2 = CmdBar.Ctrl.create(); // NB: auto transport
      const expectCounter = (value: number) =>
        expect((transport.current as any).counter.value).to.eql(value);

      let fired = 0;
      ctrl1.cmd.events().on('Invoke', () => fired++);
      ctrl2.cmd.events().on('Invoke', () => fired++);

      expectCounter(0);
      ctrl1.invoke({});
      ctrl2.invoke({});
      await Time.wait(0);
      expectCounter(1);
      expect(fired).to.eql(2);
    });
  });

  describe('CmdBar.Is', () => {
    const NON = [123, 'abc', [], {}, null, true, Symbol('foo'), BigInt(0)];

    it('Is.methods', () => {
      const ctrl = CmdBar.Ctrl.create();
      NON.forEach((v) => expect(CmdBar.Is.methods(v)).to.eql(false));
      expect(CmdBar.Is.methods(ctrl)).to.eql(true);
    });

    it('Is.ctrl', () => {
      const ctrl = CmdBar.Ctrl.create();
      NON.forEach((v) => expect(CmdBar.Is.ctrl(v)).to.eql(false));
      expect(CmdBar.Is.ctrl({ cmd: ctrl.cmd })).to.eql(false);
      expect(CmdBar.Is.ctrl(ctrl)).to.eql(true);
    });
  });
});
