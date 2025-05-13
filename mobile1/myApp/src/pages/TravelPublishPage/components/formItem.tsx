import { View, Text, ITouchEvent } from '@tarojs/components'
import {
  Controller,
  ControllerProps,
  FieldValues,
  UseControllerProps,
  GlobalError,
  FieldPath,
  ControllerRenderProps
} from 'react-hook-form'

type FormItemProps<T extends FieldValues, TName extends FieldPath<T>> = {
  label?: string
  required?: boolean
  errors?: GlobalError
  style?: React.CSSProperties
  labelStyle?: React.CSSProperties
} & ControllerProps<T, TName> &
  UseControllerProps<T, TName> &
  { render: (props: ControllerRenderProps<T, TName>) => React.ReactElement | null }

const FormItem = <T extends FieldValues, TName extends FieldPath<T>>(
  props: FormItemProps<T, TName>
) => {
  const {
    name,
    control,
    rules,
    errors,
    style = {},
    render
  } = props

  const handleChange = (
    e: ITouchEvent | unknown,
    field: ControllerRenderProps<T, TName>
  ) => {
    // 统一处理Taro组件事件参数
    const value = (e as ITouchEvent)?.detail?.value || 
                (e as ITouchEvent)?.detail?.checked ||
                (typeof e === 'object' ? e : undefined)
    field.onChange(value !== undefined ? value : e)
  }

  return (
    <View key={name} style={style}>
      {/* 错误提示 */}
      {errors?.message && (
        <View style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text style={{ color: '#ff4d4f', fontSize: 12 }}>{errors.message}</Text>
        </View>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          // 解决属性重复问题（图片中的核心报错）
          const { onChange, ...restField } = field
          
          return render({
            ...restField, // 保留未冲突的属性
            value: field.value as T[TName], // 修正类型断言为具体泛型参数
            onChange: (e: unknown) => handleChange(e, field),
            onBlur: field.onBlur
          })
        }}
      />
    </View>
  )
}

export default FormItem