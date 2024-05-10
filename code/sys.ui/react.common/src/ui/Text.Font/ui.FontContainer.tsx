import { css, type t } from './common';
import { useFont } from './Font.useFont';

export type FontContainerProps = {
  children?: React.ReactNode;
  fonts?: t.FontDefinition | t.FontDefinition[];
  loading?: JSX.Element;
  style?: t.CssValue;
  onReady?: () => void;
};

export const FontContainer: React.FC<FontContainerProps> = (props) => {
  const { onReady } = props;

  const fonts = useFont(props.fonts ?? [], { onReady });
  if (!fonts.ready) return props.loading ?? null;

  return <div {...css(props.style)}>{props.children}</div>;
};
