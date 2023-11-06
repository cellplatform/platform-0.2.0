import { useState } from 'react';
import { Icons, Time, css, type t } from './common';
import { Button } from './ui.Button';

export type TitleProps = Pick<t.DevPeerCardProps, 'peer' | 'prefix' | 'style'>;

export const Title: React.FC<TitleProps> = (props) => {
  const self = props.peer.self;
  const selfid = self.id;
  const prefix = props.prefix ?? 'peer:';

  const [copied, setCopied] = useState(false);

  /**
   * Handlers
   */
  const copyPeerId = () => {
    navigator.clipboard.writeText(selfid);
    setCopied(true);
    Time.delay(1500, () => setCopied(false));
  };

  /**
   * Render
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>
        {`🌳 ${prefix} `}
        <Button onClick={copyPeerId}>{copied ? '(copied)' : selfid}</Button>
      </div>
      <Button style={{ marginRight: 0 }} onClick={copyPeerId}>
        <Icons.Copy size={16} />
      </Button>
    </div>
  );
};
