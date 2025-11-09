import { useMemo } from 'react';
import { bem } from '../utils';
import { useParentClass } from '../context';

interface IUseClassNameOptions {
  blockName: string;
  modifiers?: string[];
  elementName?: string;
  additionalClasses?: string[];
}

export const useClassName = ({
  blockName,
  modifiers,
  elementName,
  additionalClasses = [],
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

      return '';
    };

    const elementClass = getElementClass();

    return [blockClass, elementClass, ...additionalClasses]
      .filter(Boolean)
      .join(' ');
  }, [blockName, modifiers, parentClass, elementName, additionalClasses]);

  return className;
};
