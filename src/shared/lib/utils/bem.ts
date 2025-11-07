/**
 * Генератор классов по методологии BEM
 * @param blockName - имя блока или результат предыдущего вызова bem (для вложенных модификаторов)
 * @param className - имя элемента (string) или массив модификаторов (string[])
 * @returns строка с CSS классами
 * @example
 * // Блок
 * bem('card') // 'card'
 *
 * // Элемент
 * bem('card', 'title') // 'card__title'
 *
 * // Блок с модификаторами
 * bem('card', ['active', 'large']) // 'card card_active card_large'
 *
 * // Элемент с модификаторами (вложенный вызов)
 * bem(bem('card', 'title'), ['active']) // 'card__title card__title_active'
 */
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
