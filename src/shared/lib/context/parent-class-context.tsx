/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type ReactNode,
} from 'react';

interface IParentClassContext {
  parentClass?: string;
}

const ParentClassContext = createContext<IParentClassContext>({
  parentClass: undefined,
});

interface IParentClassProviderProps {
  parentClass?: string;
  children: ReactNode;
}

export const ParentClassProvider: FC<IParentClassProviderProps> = ({
  parentClass,
  children,
}) => {
  const contextValue = useMemo(() => ({ parentClass }), [parentClass]);

  return (
    <ParentClassContext.Provider value={contextValue}>
      {children}
    </ParentClassContext.Provider>
  );
};

export const useParentClass = (): string | undefined => {
  const context = useContext(ParentClassContext);

  return context.parentClass;
};
