import { describe, it, expect } from 'vitest';
import { createClassName } from './class-name';

describe('createClassName', () => {
  it('должна возвращать только блок без дополнительных параметров', () => {
    const result = createClassName({
      blockName: 'button',
    });

    expect(result).toBe('button');
  });

  it('должна возвращать блок с модификаторами', () => {
    const result = createClassName({
      blockName: 'button',
      modifiers: ['primary', 'large'],
    });

    expect(result).toBe('button button_primary button_large');
  });

  it('должна возвращать блок с элементом родительского класса', () => {
    const result = createClassName({
      blockName: 'add-card-button',
      parentClass: 'card-list',
    });

    expect(result).toBe('add-card-button card-list__add-card-button');
  });

  it('должна возвращать блок с модификаторами и элементом', () => {
    const result = createClassName({
      blockName: 'button',
      modifiers: ['primary'],
      parentClass: 'form',
    });

    expect(result).toBe('button button_primary form__button');
  });

  it('должна игнорировать элемент если нет parentClass', () => {
    const result = createClassName({
      blockName: 'button',
    });

    expect(result).toBe('button');
  });

  it('должна игнорировать пустые модификаторы', () => {
    const result = createClassName({
      blockName: 'button',
      modifiers: ['primary', '', 'large'],
    });

    expect(result).toBe('button button_primary button_large');
  });

  it('должна добавлять дополнительные классы', () => {
    const result = createClassName({
      blockName: 'button',
      additionalClasses: ['custom-class', 'another-class'],
    });

    expect(result).toBe('button custom-class another-class');
  });

  it('должна фильтровать пустые дополнительные классы', () => {
    const result = createClassName({
      blockName: 'button',
      additionalClasses: ['custom-class', '', 'another-class'],
    });

    expect(result).toBe('button custom-class another-class');
  });

  it('должна обрабатывать полный набор параметров', () => {
    const result = createClassName({
      blockName: 'button',
      modifiers: ['primary'],
      parentClass: 'form',
      additionalClasses: ['custom'],
    });

    expect(result).toBe('button button_primary form__button custom');
  });

  it('должна обрабатывать полный набор параметров с elementName', () => {
    const result = createClassName({
      blockName: 'button',
      modifiers: ['primary'],
      parentClass: 'form',
      elementName: 'submit',
      additionalClasses: ['custom'],
    });

    expect(result).toBe('button button_primary form__submit custom');
  });
});
