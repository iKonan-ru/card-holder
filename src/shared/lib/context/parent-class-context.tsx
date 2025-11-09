/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type FC, type ReactNode } from 'react';

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
  return (
    <ParentClassContext.Provider value={{ parentClass }}>
      {children}
    </ParentClassContext.Provider>
  );
};

export const useParentClass = (): string | undefined => {
  const context = useContext(ParentClassContext);

  return context.parentClass;
};
