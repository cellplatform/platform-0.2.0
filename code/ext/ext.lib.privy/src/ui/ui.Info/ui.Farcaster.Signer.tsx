import { Button, Color, css, type t } from './common';

export type FarcasterSignerProps = {
  enabled?: boolean;
  fc: t.Farcaster;
  modifiers?: t.InfoFieldModifiers;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const FarcasterSigner: React.FC<FarcasterSignerProps> = (props) => {
  const { fc, enabled = true } = props;
  const hasSigner = !!fc.account?.signerPublicKey;

  /**
   * Handlers
   */
  const handleSignerClick = async () => {
    //
    console.log('fc', fc);
    const res = await fc.signer.requestFarcasterSignerFromWarpcast();
    console.log('res', res);
  };

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({ color: theme.fg }),
  };

  const elCreateSigner = !hasSigner && (
    <Button.Blue
      label={'Create Signer'}
      enabled={enabled}
      theme={theme.name}
      onClick={handleSignerClick}
    />
  );

  return <div {...css(styles.base, props.style)}>{elCreateSigner}</div>;
};
