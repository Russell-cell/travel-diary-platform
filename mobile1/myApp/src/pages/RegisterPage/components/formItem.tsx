import { View, Text } from '@tarojs/components'
import {
  Controller,
  ControllerProps,
  FieldValues,
  UseControllerProps,
  FieldPath
} from 'react-hook-form'
import { CSSProperties } from 'react'

type FormItemProps<T extends FieldValues, TName extends FieldPath<T>> = {
  label?: string
  required?: boolean
  errors?: { message?: string }
  style?: CSSProperties
  labelStyle?: CSSProperties
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
    style = {},
    labelStyle = {},
    border = true,
    render
  } = props

  return (
    <View key={name} style={style}>
      {label && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '5px'
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginBottom: '5px',
              fontWeight: 700,
              ...labelStyle
            }}
          >
            {label}
            {required && <Text style={{ color: 'red' }}>*</Text>}
          </Text>

          {errors?.message && (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ color: 'red', fontSize: 14 }}>
                {errors.message}
              </Text>
            </View>
          )}
        </View>
      )}

      <View
        style={{
          height: '40px',
          borderWidth: errors?.message ? 1 : border ? 1 : 0,
          borderColor: errors?.message 
            ? '#D52D0B' 
            : border 
            ? '#B3BAC1' 
            : 'transparent',
          borderRadius: '4px'
        }}
      >
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={render}
        />
      </View>
    </View>
  )
}

export default FormItem