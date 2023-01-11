import { type t } from '../../common';
import { IconView as View } from './Icon.View';
import type { IconComponent } from './Icon.View';

export const Icon = {
  View,
  renderer(type: IconComponent): t.IconRenderer {
    return (props: t.IconProps) => <View type={type} {...props} />;
  },
};
