import { bem } from './bem';

interface ICreateClassNameOptions {
  blockName: string;
  modifiers?: string[];
  parentClass?: string;
  elementName?: string;
  additionalClasses?: string[];
}

export const createClassName = ({
  blockName,
  modifiers,
  parentClass,
  elementName,
  additionalClasses = [],
}: ICreateClassNameOptions): string => {
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
};
