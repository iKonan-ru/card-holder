import {
  SPACE_CHAR,
  BEM_MODIFIER_SEPARATOR,
  BEM_ELEMENT_SEPARATOR,
} from '../constants';

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
          result.push(`${blockName}${BEM_MODIFIER_SEPARATOR}${mod}`);
        }
      });
    } else {
      result.push(`${blockName}${BEM_ELEMENT_SEPARATOR}${className}`);
    }

    return result.join(SPACE_CHAR);
  }

  return blockName;
};
