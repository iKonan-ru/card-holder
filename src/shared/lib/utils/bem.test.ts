import { describe, expect, it } from 'vitest';
import { bem } from './bem';

describe('bem', () => {
  it('должна вернуть имя блока без модификаторов', () => {
    const result = bem('block');

    expect(result).toBe('block');
  });

  it('должна вернуть блок с элементом', () => {
    const result = bem('block', 'element');

    expect(result).toBe('block__element');
  });

  it('должна вернуть блок с массивом модификаторов', () => {
    const result = bem('block', ['modifier1', 'modifier2']);

    expect(result).toBe('block block_modifier1 block_modifier2');
  });

  it('должна игнорировать пустые модификаторы в массиве', () => {
    const result = bem('block', ['modifier1', '', 'modifier2']);

    expect(result).toBe('block block_modifier1 block_modifier2');
  });

  it('должна вернуть только блок для пустого массива модификаторов', () => {
    const result = bem('block', []);

    expect(result).toBe('block');
  });

  it('должна вернуть только блок для массива с пустыми строками', () => {
    const result = bem('block', ['', '']);

    expect(result).toBe('block');
  });
});
