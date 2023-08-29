import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';

import { Wrangle } from './Wrangle';
import { DEFAULTS, Pkg, PropList, t } from './common';
import { FieldLogin } from './field.Login';
import { FieldModuleVerify } from './field.Module.Verify';

export const List: React.FC<t.InfoProps> = (props) => {
  const { fields = DEFAULTS.fields.default, data = DEFAULTS.data } = props;
  const privy = usePrivy();
  const user = privy.user;

  const items = PropList.builder<t.InfoField>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Module.Verify', () => FieldModuleVerify(data))
    .field('Login', () => FieldLogin(privy, fields, data))
    .field('Id.User', () => (user ? { label: 'User Identifier', value: user.id } : undefined))
    .items(fields);

  useEffect(() => {
    props.onChange?.({ status: Wrangle.toStatus(privy), privy });
  }, [Wrangle.toDepFlag(privy)]);

  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
      style={props.style}
    />
  );
};
