import { Ctrl, DEFAULTS } from '.';
import { Cmd, Immutable, ObjectPath, Time, describe, expect, it, type t } from '../../test';
import { CmdBar } from '../CmdBar';

describe('CmdBar.Ctrl', () => {
  const testSetup = () => {
    const transport = Immutable.clonerRef({});
    const cmd = Cmd.create<t.CmdBarCtrlType>(transport) as t.Cmd<t.CmdBarCtrlType>;

    const ctrl = CmdBar.Ctrl.create();
    const ref: t.CmdBarRef = {
      ctrl,
      state: transport,
      paths: DEFAULTS.paths,
    };

    return { cmd, transport, ref } as const;
  };

  it('exposed from <CmdBar>', () => {
    expect(CmdBar.Ctrl).to.equal(Ctrl);
    expect(CmdBar.Is).to.equal(Ctrl.Is);
    expect(CmdBar.Path).to.equal(Ctrl.Path);
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
    const { cmd, ref } = testSetup();

    const ctrl1 = Ctrl.toCtrl(cmd); // From raw command.
    const ctrl2 = Ctrl.toCtrl(cmd); // From raw command (new instance)
    const ctrl3 = Ctrl.toCtrl(ctrl1);
    const ctrl4 = Ctrl.toCtrl(ctrl);
    const ctrl5 = Ctrl.toCtrl(ref);

    expect(CmdBar.Is.ctrl(ctrl1)).to.eql(true);
    expect(ctrl1).to.not.equal(ctrl2);
    expect(ctrl3).to.equal(ctrl1); // NB: same instance reused.
    expect(ctrl4).to.equal(ctrl);
    expect(ctrl5).to.equal(ref.ctrl);
  });

  describe('Ctrl.Is', () => {
    const Is = CmdBar.Is;
    const NON = [123, 'abc', [], {}, undefined, null, true, Symbol('foo'), BigInt(0)];

    it('Is.ctrl', () => {
      const ctrl = CmdBar.Ctrl.create();
      NON.forEach((v) => expect(CmdBar.Is.ctrl(v)).to.eql(false));
      expect(Is.ctrl(ctrl)).to.eql(true);
      expect(Is.ctrl({ cmd: ctrl._ })).to.eql(false);
      expect(Is.ctrl(ctrl)).to.eql(true);
    });

    it('Is.ref', () => {
      NON.forEach((v) => expect(Is.ref(v)).to.eql(false));
      const { ref } = testSetup();
      expect(Is.ref(ref)).to.eql(true);
    });

    it('Is.paths', () => {
      NON.forEach((v) => expect(Is.paths(v)).to.eql(false));
      expect(Is.paths({ foo: ['one'] })).to.eql(false);
      expect(Is.paths({ cmd: 123, text: 'hello' })).to.eql(false);
      expect(Is.paths(DEFAULTS.paths)).to.eql(true);
    });
  });
});
