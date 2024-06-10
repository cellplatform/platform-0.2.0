import { useState } from 'react';
import { Button, Color, Icons, css, type t } from './common';

export type FarcasterCreateSignerProps = {
  fc: t.Farcaster;
  enabled?: boolean;
  modifiers?: t.InfoFieldModifiers;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const FarcasterCreateSigner: React.FC<FarcasterCreateSignerProps> = (props) => {
  const { fc, enabled = true } = props;
  const [requestingSigner, setRequestingSigner] = useState(false);

  /**
   * Handlers
   */
  const handleSignerClick = async () => {
    setRequestingSigner(true);
    await fc.requestSignerFromWarpcast();
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
