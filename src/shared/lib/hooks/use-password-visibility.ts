import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {
  TOGGLE_SHOW_PASSWORD_LABEL,
  TOGGLE_HIDE_PASSWORD_LABEL,
} from '@shared/ui';

interface IUsePasswordVisibilityParams {
  isControlled: boolean;
  externalIsVisible?: boolean;
  onExternalChange?: (isVisible: boolean) => void;
}

interface IUsePasswordVisibility {
  isVisible: boolean;
  inputType: 'text' | 'password';
  ariaLabel: string;
  Icon: typeof FiEye | typeof FiEyeOff;
  toggleVisibility: () => void;
}

export const usePasswordVisibility = (
  params: IUsePasswordVisibilityParams
): IUsePasswordVisibility => {
  const { isControlled, externalIsVisible, onExternalChange } = params;
  const [internalIsVisible, setInternalIsVisible] = useState(false);

  const isVisible = isControlled
    ? (externalIsVisible ?? false)
    : internalIsVisible;

  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  const toggleVisibility = useCallback(() => {
    if (isControlled && onExternalChange) {
      onExternalChange(!isVisibleRef.current);
    } else {
      setInternalIsVisible((previous) => !previous);
    }
  }, [isControlled, onExternalChange]);

  const inputType = useMemo(() => {
    return isVisible ? 'text' : 'password';
  }, [isVisible]);

  const ariaLabel = useMemo(() => {
    return isVisible ? TOGGLE_HIDE_PASSWORD_LABEL : TOGGLE_SHOW_PASSWORD_LABEL;
  }, [isVisible]);

  const Icon = useMemo(() => {
    return isVisible ? FiEyeOff : FiEye;
  }, [isVisible]);

  return {
    isVisible,
    inputType,
    ariaLabel,
    Icon,
    toggleVisibility,
  };
};
