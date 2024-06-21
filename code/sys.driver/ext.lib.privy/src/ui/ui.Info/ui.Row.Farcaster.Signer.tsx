import { useState } from 'react';
import { Button, Color, Icons, css, type t } from './common';

export type FarcasterSignerProps = {
  cmd?: t.Cmd<t.FarcasterCmd>;
  enabled?: boolean;
  modifiers?: t.InfoFieldModifiers;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const FarcasterSigner: React.FC<FarcasterSignerProps> = (props) => {
  const { enabled = true, cmd } = props;
  const [requestingSigner, setRequestingSigner] = useState(false);

  /**
   * Handlers
   */
  const handleSignerClick = async () => {
    if (!cmd) return;
    setRequestingSigner(true);

    const method = cmd.method('req:signer', 'req:signer:res');
    await method({}).promise();

    setRequestingSigner(false);
  };

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({ color: theme.fg }),
    button: css({
      display: 'grid',
      placeItems: 'center',
      gridTemplateColumns: `repeat(2, auto)`,
      columnGap: '5px',
    }),
  };

  const elCreateSigner = (
    <div {...styles.button}>
      <Button.Blue
        label={'Create Signer'}
        enabled={enabled}
        spinning={requestingSigner}
        theme={theme.name}
        onClick={handleSignerClick}
      />
      <Icons.Signature size={18} color={theme.fg} />
    </div>
  );

  return <div {...css(styles.base, props.style)}>{elCreateSigner}</div>;
};
