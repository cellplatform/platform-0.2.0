export const Util = {
  isSubField(all: string[], field: string) {
    if (!field.includes('.')) return false;
    const prefix = field.substring(0, field.lastIndexOf('.'));
    return all.includes(prefix);
  },
};
