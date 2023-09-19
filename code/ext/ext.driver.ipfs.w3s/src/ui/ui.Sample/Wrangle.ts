export const Url = {
  cid(cid: string) {
    return `https://${cid}.ipfs.w3s.link`;
  },

  name(cid: string, name?: string) {
    if (!name) return Url.cid(cid);
    return `https://${cid}.ipfs.w3s.link/${name}`;
  },
} as const;

export const Wrangle = { Url } as const;
