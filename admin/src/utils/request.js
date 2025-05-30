import axios from "axios";

// 配置 baseURL
const request = axios.create({
  // baseURL: 'http://5fvskc9y2ble.xiaomiqiu.com',
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

//添加请求拦截器 请求发送前进行统一处理
request.interceptors.request.use((config)=>{
  // const token = getToken()
  // if(token){
  //   config.headers.Authorization = `Bearer ${token}`
  // }
  return config
},(error)=>{
  return Promise.reject(error)
})

//添加响应拦截器 请求响应后处理数据
request.interceptors.response.use((response) => {
  return response.data
},(error)=>{
  return Promise.reject(error)
})

export {request}