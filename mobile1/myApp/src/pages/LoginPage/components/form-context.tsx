// form-context.tsx
import { createContext, useContext } from 'react'
import { 
  UseFormReturn, 
  useForm, 
  FormProvider, 
  FieldValues, 
  UseFormWatch,
  UseFormGetValues
} from 'react-hook-form'

type FormContextType<T extends FieldValues = FieldValues> = UseFormReturn<T> & {
  layout?: 'horizontal' | 'vertical'
}

const FormContext = createContext<FormContextType<any> | null>(null)

export function useFormContext<T extends FieldValues>() {
  const context = useContext(FormContext) as UseFormReturn<T>
  if (!context) {
    throw new Error('useFormContext必须在TaroFormProvider内使用')
  }
  return context
}

export function TaroFormProvider<T extends FieldValues>({
  children,
  methods,
  ...props
}: {
  children: React.ReactNode
  methods?: UseFormReturn<T>
} & Partial<FormContextType<T>>) {
  const defaultMethods = useForm<T>()
  
  return (
    <FormContext.Provider value={{ 
      ...(methods || defaultMethods), 
      ...props 
    } as FormContextType<T>}>
      <FormProvider {...(methods || defaultMethods)}>
        {children}
      </FormProvider>
    </FormContext.Provider>
  )
}