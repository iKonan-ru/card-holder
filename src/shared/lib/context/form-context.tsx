/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type ReactNode,
} from 'react';

type TFieldChangeHandler = (name: string, value: string) => void;
type TFieldValidateHandler = (name: string, error: string | undefined) => void;

interface IFormContext {
  onChange?: TFieldChangeHandler;
  onValidate?: TFieldValidateHandler;
}

const FormContext = createContext<IFormContext>({
  onChange: undefined,
  onValidate: undefined,
});

interface IFormProviderProps {
  onChange?: TFieldChangeHandler;
  onValidate?: TFieldValidateHandler;
  children: ReactNode;
}

export const FormProvider: FC<IFormProviderProps> = ({
  onChange,
  onValidate,
  children,
}) => {
  const contextValue = useMemo(
    () => ({ onChange, onValidate }),
    [onChange, onValidate]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};

export const useFormContext = (): IFormContext => {
  return useContext(FormContext);
};
