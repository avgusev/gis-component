export const cutString = (string: string, limit: number): string => {
  let limitstr = string;
  if (string.length > limit && limit > 0) {
    const substrStr = string.substr(0, limit);
    limitstr = substrStr + '...';
  }

  return limitstr;
};
