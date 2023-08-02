import { FC } from '.';
import { describe, expect, it } from '../../test';

describe('FC (Functional Component)', () => {
  describe('FC.decorate', () => {
    it('assigns fields', () => {
      type FooProps = { count?: number };
      const View: React.FC<FooProps> = (props) => <div>{props.count}</div>;

      type F = { helper: () => boolean };
      const helper = () => true;
      const Foo = FC.decorate<FooProps, F>(View, { helper });

      expect(Foo).to.equal(View);
      expect(Foo.helper).to.eql(helper);
    });

    it('displayName', () => {
      type FooProps = { count?: number };
      const View1: React.FC<FooProps> = (props) => <div />;
      const View2: React.FC<FooProps> = (props) => <div />;

      type F = { helper: () => boolean };
      const helper = () => true;
      const Foo1 = FC.decorate<FooProps, F>(View1, { helper });
      const Foo2 = FC.decorate<FooProps, F>(View2, { helper }, { displayName: 'FooBar' });

      expect(Foo1.displayName).to.eql(undefined);
      expect(Foo2.displayName).to.eql('FooBar');
    });
  });
});
