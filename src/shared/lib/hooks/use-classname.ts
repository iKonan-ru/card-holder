import { useMemo } from 'react';
import { bem } from '../utils';
import { useParentClass } from '../context';
import { EMPTY_STRING, SPACE_CHAR } from '../constants/constants';

interface IUseClassNameOptions {
  blockName: string;
  modifiers?: string[];
  elementName?: string;
  additionalClasses?: string[];
}

const DEFAULT_ADDITIONAL_CLASSES: string[] = [];

export const useClassName = ({
  blockName,
  modifiers,
  elementName,
  additionalClasses = DEFAULT_ADDITIONAL_CLASSES,
}: IUseClassNameOptions): string => {
  const parentClass = useParentClass();

  const className = useMemo(() => {
    const blockClass = modifiers ? bem(blockName, modifiers) : bem(blockName);

    const getElementClass = () => {
      if (parentClass && elementName) {
        return bem(parentClass, elementName);
      }

      if (parentClass) {
        return bem(parentClass, blockName);
      }

      return EMPTY_STRING;
    };

    const elementClass = getElementClass();

    return [blockClass, elementClass, ...additionalClasses]
      .filter(Boolean)
      .join(SPACE_CHAR);
  }, [blockName, modifiers, parentClass, elementName, additionalClasses]);

  return className;
};
