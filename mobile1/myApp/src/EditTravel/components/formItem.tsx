import { View, Text } from '@tarojs/components'
import { Controller } from 'react-hook-form'
import type { 
  ControllerProps,
  FieldValues,
  UseControllerProps,
  FieldPath
} from 'react-hook-form'
import './formItem.scss'

type FormItemProps<T extends FieldValues, TName extends FieldPath<T>> = {
  label?: string
  required?: boolean
  errors?: { message?: string }
  containerStyle?: React.CSSProperties
  labelStyle?: React.CSSProperties
  border?: boolean
} & ControllerProps<T, TName> &
  UseControllerProps<T, TName>

const FormItem = <T extends FieldValues, TName extends FieldPath<T>>(
  props: FormItemProps<T, TName>
) => {
  const {
    name,
    control,
    rules,
    label,
    required,
    errors,
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
          control={control}
          rules={rules}
          render={render}
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