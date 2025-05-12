import { View, Text } from '@tarojs/components'
import {
  Controller,
  Control,
  FieldValues,
  FieldPath,
  UseControllerProps,
  ControllerRenderProps,
  Path,
  PathValue,
  ControllerProps,
  UseFormStateReturn
} from 'react-hook-form'
import './formItem.scss'

type FormItemProps<T extends FieldValues, TName extends FieldPath<T>> = {
  label?: string
  required?: boolean
  error?: string
  containerStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
  border?: boolean
  render: (props: {
    field: ControllerRenderProps<T, TName>
    fieldState: UseFormStateReturn<T>['errors']
    formState: UseFormStateReturn<T>
  }) => React.ReactElement | null
} & UseControllerProps<T, TName> & ControllerProps<T, TName>

const FormItem = <T extends FieldValues, TName extends FieldPath<T>>(
  props: FormItemProps<T, TName>
) => {
  const {
    name,
    control,
    rules,
    label,
    required,
    error,
    containerStyle = {},
    labelStyle = {},
    border = true,
    render
  } = props

  return (
    <View 
      className={`form-item ${border ? 'form-item--border' : ''}`}
      style={containerStyle}
    >
      {label && (
        <View className="form-item__label">
          <Text style={labelStyle}>
            {required && <Text className="required-asterisk">*</Text>}
            {label}
          </Text>
        </View>
      )}
      
      <View className="form-item__control">
        <Controller
          name={name}
          control={control as Control<T>}
          rules={rules}
          render={({ field, fieldState, formState }) => 
            render({
              field: {
                ...field,
                name: name as TName,
                onChange: (e: unknown) => {
                  const eventValue = (e as any)?.detail?.value || 
                                   (e as any)?.target?.value || 
                                   (Array.isArray(e) ? e[0]?.value : e)
                  field.onChange(eventValue as PathValue<T, TName>)
                },
                onBlur: () => field.onBlur(),
                value: field.value as PathValue<T, TName>
              },
              fieldState: fieldState,
              formState: formState
            })
          }
        />
      </View>

      {error && (
        <View className="form-item__error">
          <Text className="error-message">{error}</Text>
        </View>
      )}
    </View>
  )
}

export default FormItem