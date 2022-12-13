import { Path, Color, COLORS, css, t, rx } from '../common';

export const Wrangle = {
  mediaFromUrl(href: string) {
    const url = new URL(href);
    const params = url.searchParams;
    const path = Path.trimSlashesEnd(url.pathname);

    let image = LINKS.RO_1;
    let name = 'Rowan Yeoman';

    if (path.endsWith('/nic') || params.has('nic')) {
      image = LINKS.NIC_2;
      name = 'Nic Wise';
    }

    if (path.endsWith('/allen') || params.has('allen')) {
      image = LINKS.ANC_RIVER;
      name = 'Allen Cockfield';
    }

    return { image, name };
  },
};

/**
 * Constants
 */

const LINKS = {
  RO_1: 'https://user-images.githubusercontent.com/185555/206095850-8b561843-50f3-4549-a5e3-dcfc6bae474d.png',
  RO_2: 'https://user-images.githubusercontent.com/185555/206325854-f418b496-cb14-4ff2-8f66-1c91d40ecb7a.png',

  NIC_1:
    'https://user-images.githubusercontent.com/185555/206830932-dfdc3f93-bd21-4b82-a978-dfa993e710f9.png',
  NIC_2:
    'https://user-images.githubusercontent.com/185555/206831627-c06aec2e-d496-4342-b7ac-e542542db53d.png',

  ANC_RIVER:
    'https://user-images.githubusercontent.com/185555/206985006-18bf5e3c-b6f2-4a47-8036-9513e842797e.png',
};
