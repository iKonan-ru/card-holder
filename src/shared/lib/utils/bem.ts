import {
  SPACE_CHAR,
  BEM_MODIFIER_SEPARATOR,
  BEM_ELEMENT_SEPARATOR,
} from '../constants/common';

const INITIAL_RESULT: string[] = [];

export const bem = (
  blockName: string,
  className?: string | string[]
): string => {
  if (className) {
    const result: string[] = [...INITIAL_RESULT];

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
