import React, { useState } from 'react';
import { View, Text, Input, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import FormItem from './components/formItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import { AntDesign } from '@expo/vector-icons';

const RegisterScreen = () => {
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSure, setShowPasswordSure] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState({ file: null });
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      nickname: '',
      password: '',
      passwordsure: '',
    },
  });

  // 图片选择适配Taro
  const pickImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
      });

      if (res.tempFilePaths.length > 0) {
        const uri = res.tempFilePaths[0];
        const uriArr = uri.split('/');
        const name = uriArr[uriArr.length - 1];
        
        setImage(uri);
        setFile({
          file: {
            uri,
            name,
            type: 'image/jpeg',
          }
        });
      }
    } catch (err) {
      Taro.showToast({ title: '选择图片失败', icon: 'none' });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    if (file.file) {
      const formData = new FormData();
      delete data.passwordsure;

      Object.entries({ ...file, ...data }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        const res = await axios.post(NGROK_URL + '/users/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setIsLoading(false);
        
        if (res.data === "注册成功") {
          Taro.showToast({
            title: '注册成功',
            icon: 'success',
            complete: () => Taro.navigateTo({ url: '/pages/login/index' })
          });
        } else {
          Taro.showToast({ title: res.data.message || '注册失败', icon: 'none' });
        }
      } catch (err) {
        setIsLoading(false);
        Taro.showToast({ title: '请求失败', icon: 'none' });
      }
    } else {
      setIsLoading(false);
      Taro.showToast({ title: '请上传头像', icon: 'none' });
    }
  };

  return (
    <View className="flex flex-col h-screen bg-gray-100">
      <LoadingOverlay isVisible={isLoading} />
      
      <View className="p-4">
        <AntDesign 
          name="left" 
          size={48} 
          className="text-black mt-4" 
          onClick={() => Taro.navigateBack()}
        />

        <Text className="text-2xl font-medium text-center my-6 text-blue-600">用户注册</Text>

        <FormItem
          required
          name="username"
          label="用户名"
          control={control}
          errors={errors.username}
          rules={{
            required: '不能为空',
            pattern: {
              value: /^[a-zA-Z0-9_-]{4,16}$/,
              message: '4到16位(字母,数字,下划线,减号)',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onInput={onChange}
              placeholder="4到16位(字母,数字,下划线,减号)"
              className="text-lg h-10 pl-2 border rounded"
            />
          )}
        />

        {/* 其他表单项结构相同，省略重复代码 */}

        <View className="flex flex-row items-center my-4">
          <Text className="text-lg font-bold mr-4">上传头像</Text>
          <View 
            className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center"
            onClick={pickImage}
          >
            {!image && <Text className="text-6xl text-gray-400">+</Text>}
            {image && <Image src={image} className="w-full h-full rounded-full" />}
          </View>
        </View>

        <Button 
          className="bg-blue-500 text-white text-lg py-2 rounded-lg mt-6"
          onClick={handleSubmit(onSubmit)}
        >
          注册
        </Button>
      </View>
    </View>
  );
};


export default RegisterScreen;