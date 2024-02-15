import { Monaco } from 'ext.lib.monaco.crdt';
import { css, type t } from './common';

export type SampleProps = {
  text?: string;
  style?: t.CssValue;
  onChange?: (e: { text: string }) => void;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
  };

  const elEditor = (
    <Monaco.Editor
      style={css(styles.base, props.style)}
      focusOnLoad={true}
      text={props.text}
      language={'markdown'}
      onReady={(e) => {}}
      onChange={(e) => props.onChange?.({ text: e.text })}
    />
  );

  return <div {...css(styles.base, props.style)}>{elEditor}</div>;
};
