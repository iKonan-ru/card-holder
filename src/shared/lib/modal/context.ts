import { createContext } from 'react';
import type { IModalContextValue } from './types';

export const ModalContext = createContext<IModalContextValue | null>(null);
