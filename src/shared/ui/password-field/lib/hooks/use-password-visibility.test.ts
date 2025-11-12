import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { usePasswordVisibility } from './use-password-visibility';

describe('usePasswordVisibility', () => {
  describe('неконтролируемый режим', () => {
    it('должен инициализироваться с isVisible = false', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      expect(result.current.isVisible).toBe(false);
    });

    it('должен возвращать type="password" по умолчанию', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      expect(result.current.inputType).toBe('password');
    });

    it('должен возвращать иконку MdVisibility по умолчанию', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      expect(result.current.Icon).toBe(MdVisibility);
    });

    it('должен возвращать aria-label "Показать пароль" по умолчанию', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      expect(result.current.ariaLabel).toBe('Показать пароль');
    });

    it('должен переключать видимость при вызове toggleVisibility', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      expect(result.current.isVisible).toBe(false);

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(true);
    });

    it('должен менять inputType на "text" при видимом пароле', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.inputType).toBe('text');
    });

    it('должен менять иконку на MdVisibilityOff при видимом пароле', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.Icon).toBe(MdVisibilityOff);
    });

    it('должен менять aria-label на "Скрыть пароль" при видимом пароле', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.ariaLabel).toBe('Скрыть пароль');
    });

    it('должен переключаться обратно при повторном вызове toggleVisibility', () => {
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: false,
        })
      );

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(true);

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('контролируемый режим', () => {
    it('должен использовать внешнее значение isVisible', () => {
      const onExternalChange = vi.fn();
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: true,
          externalIsVisible: true,
          onExternalChange,
        })
      );

      expect(result.current.isVisible).toBe(true);
    });

    it('должен использовать false если externalIsVisible undefined', () => {
      const onExternalChange = vi.fn();
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: true,
          externalIsVisible: undefined,
          onExternalChange,
        })
      );

      expect(result.current.isVisible).toBe(false);
    });

    it('должен вызывать onExternalChange при toggleVisibility', () => {
      const onExternalChange = vi.fn();
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: true,
          externalIsVisible: false,
          onExternalChange,
        })
      );

      act(() => {
        result.current.toggleVisibility();
      });

      expect(onExternalChange).toHaveBeenCalledWith(true);
    });

    it('должен вызывать onExternalChange с false при скрытии', () => {
      const onExternalChange = vi.fn();
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: true,
          externalIsVisible: true,
          onExternalChange,
        })
      );

      act(() => {
        result.current.toggleVisibility();
      });

      expect(onExternalChange).toHaveBeenCalledWith(false);
    });

    it('должен возвращать type="text" когда externalIsVisible=true', () => {
      const onExternalChange = vi.fn();
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: true,
          externalIsVisible: true,
          onExternalChange,
        })
      );

      expect(result.current.inputType).toBe('text');
    });

    it('должен возвращать MdVisibilityOff когда externalIsVisible=true', () => {
      const onExternalChange = vi.fn();
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: true,
          externalIsVisible: true,
          onExternalChange,
        })
      );

      expect(result.current.Icon).toBe(MdVisibilityOff);
    });

    it('должен обновлять состояние при изменении externalIsVisible', () => {
      const onExternalChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ externalIsVisible }) =>
          usePasswordVisibility({
            isControlled: true,
            externalIsVisible,
            onExternalChange,
          }),
        { initialProps: { externalIsVisible: false } }
      );

      expect(result.current.inputType).toBe('password');

      rerender({ externalIsVisible: true });

      expect(result.current.inputType).toBe('text');
    });

    it('не должен изменять внутреннее состояние в контролируемом режиме', () => {
      const onExternalChange = vi.fn();
      const { result } = renderHook(() =>
        usePasswordVisibility({
          isControlled: true,
          externalIsVisible: false,
          onExternalChange,
        })
      );

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(false);
    });
  });
});
