/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type PropsWithChildren,
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

interface IFormProviderProps extends PropsWithChildren {
  onChange?: TFieldChangeHandler;
  onValidate?: TFieldValidateHandler;
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
