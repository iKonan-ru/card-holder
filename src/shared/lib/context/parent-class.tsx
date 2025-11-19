/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type PropsWithChildren,
} from 'react';

export interface IParentClassContext {
  parentClass?: string;
}

const ParentClass = createContext<IParentClassContext>({
  parentClass: undefined,
});

interface IParentClassProviderProps extends PropsWithChildren {
  parentClass?: string;
}

export const ParentClassProvider: FC<IParentClassProviderProps> = ({
  parentClass,
  children,
}) => {
  const contextValue = useMemo(() => ({ parentClass }), [parentClass]);

  return (
    <ParentClass.Provider value={contextValue}>{children}</ParentClass.Provider>
  );
};

export const useParentClass = (): string | undefined => {
  const context = useContext(ParentClass);

  if (!context) {
    throw new Error('useParentClass must be used within ParentClassProvider');
  }

  const { parentClass } = context;

  return parentClass;
};
