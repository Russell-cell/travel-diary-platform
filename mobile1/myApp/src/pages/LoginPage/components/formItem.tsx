// formItem.tsx
import { View, Text, Input } from '@tarojs/components'
import { Controller, Control, FieldValues, FieldPath } from 'react-hook-form'
import { useFormContext } from './form-context'
import './formItem.scss'

type FormItemProps<T extends FieldValues> = {
  name: FieldPath<T>
  control?: Control<T>
  label?: string
  required?: boolean
  rules?: any
  errors?: { message?: string }
  className?: string
  border?: boolean
}

const FormItem = <T extends FieldValues>({
  name,
  control,
  label,
  required,
  rules,
  errors,
  className = '',
  border = true
}: FormItemProps<T>) => {
  const context = useFormContext<T>()

  return (
    <View className={`form-item ${className}`}>
      {label && (
        <View className="form-item__label">
          <Text className="label-text">
            {required && <Text className="required-asterisk">*</Text>}
            {label}
          </Text>
        </View>
      )}

      <View 
        className={`form-item__control ${errors ? 'error' : ''}`}
        style={{ borderWidth: border ? 1 : 0 }}
      >
        <Controller
          name={name}
          control={control || context.control}
          rules={rules}
          render={({ field }) => (
            <Input
              className="form-input"
              value={field.value as string ?? ''}
              onInput={e => field.onChange(e.detail.value)}
              onBlur={field.onBlur}
              placeholderClass="placeholder-style"
            />
          )}
        />
      </View>

      {errors?.message && (
        <View className="form-item__error">
          <Text className="error-message">{errors.message}</Text>
        </View>
      )}
    </View>
  )
}

export default FormItem