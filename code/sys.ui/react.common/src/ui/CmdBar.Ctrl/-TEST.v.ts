import { CmdBar } from '../CmdBar';
import { Ctrl } from '.';
import { Cmd, Immutable, Time, describe, expect, it, type t, ObjectPath } from '../../test';

describe('CmdBar.Ctrl', () => {
  const testCreate = () => {
    const transport = Immutable.clonerRef({});
    const cmd = Cmd.create<t.CmdBarCtrlType>(transport) as t.Cmd<t.CmdBarCtrlType>;
    return { cmd, transport } as const;
  };

  it('exposed from <CmdBar>', () => {
    expect(CmdBar.Ctrl).to.equal(Ctrl);
  });

  it('create (from simple Immutable<T>)', async () => {
    const transport = Immutable.clonerRef({});
    const ctrl1 = Ctrl.create(transport);
    const ctrl2 = Ctrl.create(); // NB: auto immutable "transport" construction.
    const expectCounter = (value: number) => {
      const paths = CmdBar.DEFAULTS.paths;
      const cmd = ObjectPath.resolve<t.CmdPathsObject>(transport.current, paths.cmd);
      expect(cmd?.counter?.value).to.eql(value);
    };

    let fired = 0;
    ctrl1.events().on('Invoke', () => fired++);
    ctrl2._.events().on('Invoke', () => fired++);

    expectCounter(0);
    ctrl1.invoke({ text: 'foo' });
    ctrl2.invoke({ text: 'bar' });
    await Time.wait(0);
    expectCounter(1);
    expect(fired).to.eql(2);
  });

  it('Ctrl.toCtrl', () => {
    const ctrl = Ctrl.create();
    const { cmd } = testCreate();

    const methods1 = Ctrl.toCtrl(cmd); // From raw command.
    const methods2 = Ctrl.toCtrl(cmd); // From raw command (new instance)
    const methods3 = Ctrl.toCtrl(methods1);
    const methods4 = Ctrl.toCtrl(ctrl);

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
    expect(CmdBar.Is.ctrl({ cmd: ctrl._ })).to.eql(false);
    expect(CmdBar.Is.ctrl(ctrl)).to.eql(true);
  });
});
