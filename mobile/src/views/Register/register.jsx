import React, { useState } from 'react';
import Button from 'apsl-react-native-button';
import { NGROK_URL } from '../../config/ngrok';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import {
  Text, View, TextInput, StyleSheet, TouchableOpacity,
  Image, ImageBackground, StatusBar
} from 'react-native';
import { useForm } from 'react-hook-form';
import FormItem from './components/formItem';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function RegisterScreen() {
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 修改为布尔类型
  const [showPasswordSure, setShowPasswordSure] = useState(false); // 修改为布尔类型
  const [image, setImage] = useState(null);
  const [file, setFile] = useState({ file: null });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
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

  // 选取图片
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });
    if (!result.canceled) {
      let uri = result.assets[0].uri;
      let uriArr = uri.split('/');
      let name = uriArr[uriArr.length - 1]
      setImage(uri); // 头像回显
      setFile({
        file: {
          uri,
          name,
          type: 'image/jpeg',
        }
      })
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    if (!!file.file) {  // 当存在头像文件的时候执行下面的
      const params = new FormData();
      delete data.passwordsure   // 删除'确认密码'
      data = { ...file, ...data }
      for (let i in data) {
        params.append(i, data[i]);
      };
      
      try {
        const res = await axios.post(NGROK_URL + '/users/register', params, {
          headers: {
            'Content-Type': 'multipart/form-data' // 告诉后端，有文件上传
          }
        });
        
        if (res.data === "注册成功") {
          Toast.show({
            type: 'success',
            text1: res.data,
            position: 'top',
            autoHide: true,
            visibilityTime: 1000,
          })
          navigation.navigate('登录界面');
        } else {
          Toast.show({
            type: 'error',
            text1: res.data.message,
            position: 'top',
            autoHide: true,
            visibilityTime: 1000,
          })
        }
      } catch (err) {
        console.log(err);
        Toast.show({
          type: 'error',
          text1: '注册失败，请稍后重试',
          position: 'top',
          autoHide: true,
          visibilityTime: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: "您还没有上传头像哦~",
        position: 'top',
        autoHide: true,
        visibilityTime: 1000,
      });
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1 }} 
      behavior="padding" 
      showsVerticalScrollIndicator={false}
    >
      <StatusBar backgroundColor="#E7F2EF" barStyle='dark-content' />
      <ImageBackground 
        source={require("../../../assets/register_background.png")} 
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <LoadingOverlay isVisible={isLoading} />
          
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('登录界面')}
            >
              <AntDesign name="arrowleft" size={24} color="#4A90E2" />
            </TouchableOpacity>
            <Text style={styles.title}>用户注册</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>用户名</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#4A90E2" />
                <FormItem
                  required
                  name="username"
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
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      style={styles.input}
                      placeholder="4到16位(字母,数字,下划线,减号)"
                      placeholderTextColor="#A0A0A0"
                    />
                  )}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>昵称</Text>
              <View style={styles.inputContainer}>
                <Feather name="smile" size={20} color="#4A90E2" />
                <FormItem
                  required
                  name="nickname"
                  control={control}
                  errors={errors.nickname}
                  rules={{
                    required: '不能为空',
                    pattern: {
                      value: /^((?!\\|\/|:|\*|\?|<|>|\||'|%|@|#|&|\$|\^|&|\*).){1,8}$/,
                      message: '1到8位(不包含特殊字符)',
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      style={styles.input}
                      placeholder="1到8位(不包含特殊字符)"
                      placeholderTextColor="#A0A0A0"
                    />
                  )}
                />
              </View>
              {errors.nickname && (
                <Text style={styles.errorText}>{errors.nickname.message}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>密码</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#4A90E2" />
                <FormItem
                  required
                  name="password"
                  control={control}
                  rules={{
                    required: '不能为空',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                      message: '8到16位(大小写字母和数字)',
                    },
                  }}
                  errors={errors.password}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={(text) => {
                        setPasswordValue(text);
                        onChange(text);
                      }}
                      placeholder="8到16位(大小写字母和数字)"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry={!showPassword}
                    />
                  )}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#A0A0A0"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>确认密码</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#4A90E2" />
                <FormItem
                  required
                  name="passwordsure"
                  control={control}
                  rules={{
                    required: '不能为空',
                    validate: {
                      value: (text) => {
                        if (text === passwordValue) {
                          return true
                        }
                        else {
                          return '两次密码输入需要一致'
                        }
                      }
                    }
                  }}
                  errors={errors.passwordsure}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="请再次输入密码"
                      placeholderTextColor="#A0A0A0"
                      secureTextEntry={!showPasswordSure}
                    />
                  )}
                />
                <TouchableOpacity onPress={() => setShowPasswordSure(!showPasswordSure)}>
                  <Feather 
                    name={showPasswordSure ? "eye" : "eye-off"} 
                    size={20} 
                    color="#A0A0A0"
                  />
                </TouchableOpacity>
              </View>
              {errors.passwordsure && (
                <Text style={styles.errorText}>{errors.passwordsure.message}</Text>
              )}
            </View>
            
            <View style={styles.avatarSection}>
              <Text style={styles.inputLabel}>上传头像</Text>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={pickImage}
              >
                {!image ? (
                  <View style={styles.avatarPlaceholder}>
                    <Feather name="camera" size={28} color="#4A90E2" />
                    <Text style={styles.avatarText}>添加头像</Text>
                  </View>
                ) : (
                  <Image source={{ uri: image }} style={styles.avatarImage} />
                )}
              </TouchableOpacity>
            </View>
            
            <Button 
              onPress={handleSubmit(onSubmit)}
              style={styles.registerButton}
              textStyle={styles.buttonText}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              注册
            </Button>
            
            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => navigation.navigate('登录界面')}
            >
              <Text style={styles.loginText}>
                已有账号？ <Text style={styles.loginHighlight}>去登录</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A90E2',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4A90E2',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
  avatarSection: {
    marginVertical: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  registerButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 22,
    borderWidth: 0,
    height: 45,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginHighlight: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});