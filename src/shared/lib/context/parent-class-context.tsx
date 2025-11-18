/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type PropsWithChildren,
} from 'react';

interface IParentClassContext {
  parentClass?: string;
}

const ParentClassContext = createContext<IParentClassContext>({
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
    <ParentClassContext.Provider value={contextValue}>
      {children}
    </ParentClassContext.Provider>
  );
};

export const useParentClass = (): string | undefined => {
  const { parentClass } = useContext(ParentClassContext);

  return parentClass;
};
