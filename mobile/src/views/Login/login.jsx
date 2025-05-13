import { Text, View, TextInput, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Image } from 'react-native';
import { THEME_LABEL, THEME_TEXT } from '../../assets/CSS/color';
import React, { useState, useEffect } from 'react';
import Button from 'apsl-react-native-button';
import FormItem from './components/formItem';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NGROK_URL } from '../../config/ngrok'
import '../../util/axios.config'
import { getToken } from '../../util/tokenRelated'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/userSlice';
import Toast from 'react-native-toast-message';
import { Ionicons, Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);  // 修改为布尔类型
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleregister = () => navigation.navigate("注册界面");
  const handleVisit = () => navigation.navigate("主界面");
  const handleClear = () => {
    setValue('username', '');
    setValue('password', '');
  }
  
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
  });
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(NGROK_URL + '/users/login', data);
      if (res.data.message === "登录成功") {
        Toast.show({
          type: 'success',
          text1: res.data.message,
          position: 'top',
          autoHide: true,
          visibilityTime: 1000,
        });
        
        const { _id, avatar, nickname } = res.data.user;
        dispatch(setUser({
          id: _id,
          avatar: avatar,
          nickname: nickname,
        }));
        
        handleVisit();
      } else {
        Toast.show({
          type: 'error',
          text1: res.data.message,
          position: 'top',
          autoHide: true,
          visibilityTime: 1000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '登录失败，请稍后重试',
        position: 'top',
        autoHide: true,
        visibilityTime: 1000,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const token = await getToken();
      if (token) {
        axios.get(NGROK_URL + '/users/getUserInfo', { headers: { 'token': token } })
          .then(res => {
            if (res.data._id) {
              navigation.navigate("主界面");
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    };
    checkTokenAndRedirect();
  }, []);

  return (
    <KeyboardAwareScrollView 
      style={{ flex: 1 }} 
      behavior="padding" 
      showsVerticalScrollIndicator={false} 
      scrollEnabled={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar backgroundColor="#E7F2EF" barStyle='dark-content' />
      <ImageBackground 
        source={require("../../../assets/home_background_two.png")} 
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/my_icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>旅行日记</Text>
            <Text style={styles.subtitle}>记录每一次美好旅程</Text>
          </View>
          
          <View style={styles.formContainer}>
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
                    message: '用户名错误,请输入4到16位字符',
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    placeholder='请输入您的用户名'
                    placeholderTextColor="#A0A0A0"
                  />
                )}
              />
            </View>
            
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
            
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#4A90E2" />
              <FormItem
                required
                control={control}
                name="password"
                rules={{
                  required: '不能为空',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                    message: '密码格式错误',
                  },
                }}
                errors={errors.password}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="请输入您的密码"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
              >
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
            
            <View style={styles.buttonContainer}>
              <Button 
                style={styles.loginButton} 
                textStyle={styles.buttonText} 
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                登录
              </Button>
              
              <Button 
                style={styles.resetButton} 
                textStyle={styles.resetButtonText} 
                onPress={handleClear}
              >
                重置
              </Button>
            </View>
            
            <View style={styles.subButtonContainer}>
              <TouchableOpacity onPress={handleregister}>
                <Text style={styles.subButtonText}>新用户注册</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleVisit}>
                <Text style={styles.subButtonText}>以游客身份访问</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginButton: {
    flex: 2,
    backgroundColor: '#4A90E2',
    marginRight: 10,
    height: 45,
    borderRadius: 22,
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    height: 45,
    borderRadius: 22,
    borderWidth: 0,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  subButtonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  subButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
});