import { CmdBar } from '.';
import { Immutable, Time, describe, expect, it, Cmd, type t } from '../../test';

describe('CmdBar', () => {
  describe('CmdBar.Ctrl', () => {
    const Ctrl = CmdBar.Ctrl;

    const createCmdBarCtrl = () => {
      const transport = Immutable.clonerRef({});
      return Cmd.create<t.CmdBarCtrlType>(transport) as t.Cmd<t.CmdBarCtrlType>;
    };

    it('creation (from simple Immutable<T>)', async () => {
      const transport = Immutable.clonerRef({});
      const ctrl1 = Ctrl.create(transport);
      const ctrl2 = Ctrl.create(); // NB: auto immutable "transport" construction.
      const expectCounter = (value: number) =>
        expect((transport.current as any).counter.value).to.eql(value);

      let fired = 0;
      ctrl1.cmd.events().on('Invoke', () => fired++);
      ctrl2.cmd.events().on('Invoke', () => fired++);

      expectCounter(0);
      ctrl1.invoke({ text: 'foo' });
      ctrl2.invoke({ text: 'bar' });
      await Time.wait(0);
      expectCounter(1);
      expect(fired).to.eql(2);
    });

    it('CmdBar.Ctrl.cmdbar', () => {
      const ctrl = Ctrl.create();
      const cmd = createCmdBarCtrl();

      const methods1 = Ctrl.cmdbar(cmd); // From raw command.
      const methods2 = Ctrl.cmdbar(cmd); // From raw command (new instance)
      const methods3 = Ctrl.cmdbar(methods1);
      const methods4 = Ctrl.cmdbar(ctrl);

      expect(CmdBar.Is.ctrl(methods1)).to.eql(true);
      expect(methods1).to.not.equal(methods2);
      expect(methods3).to.equal(methods1); // NB: same instance reused.
      expect(methods4).to.equal(ctrl);
    });
  });

  describe('CmdBar.Is', () => {
    const NON = [123, 'abc', [], {}, null, true, Symbol('foo'), BigInt(0)];

    it('Is.ctrl', () => {
      const ctrl = CmdBar.Ctrl.create();
      NON.forEach((v) => expect(CmdBar.Is.ctrl(v)).to.eql(false));
      expect(CmdBar.Is.ctrl(ctrl)).to.eql(true);
      expect(CmdBar.Is.ctrl({ cmd: ctrl.cmd })).to.eql(false);
      expect(CmdBar.Is.ctrl(ctrl)).to.eql(true);
    });
  });
});
