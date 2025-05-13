import Taro from '@tarojs/taro';

// 设置token的值
const storeToken = async (value) => {
  try {
    await Taro.setStorage({ key: 'token', data: value });
  } catch (e) {
    return e
  }
};
// 获取token的值
const getToken = async () => {
  try {
    const res = await Taro.getStorage({ key: 'token' });
    return res.data;
  } catch (e) {
    return e
  }
};
// 删除token
const removeToken = async () => {
  try {
    await Taro.removeStorage({ key: 'token' });
  } catch (e) {
    return e
  }
};

export { storeToken, getToken, removeToken }