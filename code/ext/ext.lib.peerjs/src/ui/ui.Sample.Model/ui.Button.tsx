import { Button as Base, type t } from './common';

export const Button = (props: t.ButtonProps) => {
  return <Base.Blue {...props} style={{ marginRight: 12, ...props.style }} />;
};
