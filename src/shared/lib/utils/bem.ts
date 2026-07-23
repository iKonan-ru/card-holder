import {
  BEM_ELEMENT_SEPARATOR,
  BEM_MODIFIER_SEPARATOR,
  SPACE_CHAR,
} from '../constants';

export const buildModifiers = (
  ...candidates: (string | false | null | undefined)[]
): string[] =>
  candidates.filter((candidate): candidate is string => Boolean(candidate));

export const bem = (
  blockName: string,
  className?: string | string[],
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
