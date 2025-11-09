export const bem = (
  blockName: string,
  className?: string | string[]
): string => {
  if (className) {
    const result: string[] = [];

    if (Array.isArray(className)) {
      result.push(blockName);
      className.forEach((mod) => {
        if (mod) {
          result.push(`${blockName}_${mod}`);
        }
      });
    } else {
      result.push(`${blockName}__${className}`);
    }

    return result.join(' ');
  }

  return blockName;
};
