import axios, { AxiosResponse } from 'axios';
import Storage from "@/util/storage";
import store from '@/store';
import { Dialog } from 'vant';
import router from '@/router';
const instance = axios.create();
instance.defaults.timeout = 2500;
instance.defaults.withCredentials = true;
let timer: number | null | undefined = null;
// instance.defaults.headers.common['Authorization'] = Storage.get("token") || "";
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (Storage.get("token")) {
    (config.headers as any).Authorization = Storage.get("token") || "";
  }
  store.commit('changeLoading', true)
  return config;
}, function (error) {
  // 对请求错误做些什么
  store.commit('changeLoading', true)
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.warn(getError(response))
  hideLoading()
  return getError(response);
}, function (error) {
  hideLoading()
  // 对响应错误做点什么
  getErrorCode(error)
  return Promise.reject(error);
});
function hideLoading() {
  timer = setTimeout(() => {
    if (timer) {
      clearTimeout(timer);
      timer = null
    }
    store.commit('changeLoading', false)
  }, 500);
}

export function getError(res: AxiosResponse<any, any>) {
  // console.log(res);
  //错误码不为零说明有错误，显示错误信息
  if (res.data.errorCode) {
    Dialog.alert({
      message: res.data.message || '',
    }).then(() => {
      // on close
    });
    return { errStatus: true, data: {} }
  }
  return { errStatus: false, data: res.data };
}

function getErrorCode(error: { response?: any; message?: any; config?: any; }) {
  //根据服务器错误码显示错误信息
  if (error) {
    switch (error.response.status) {
      case 400:
        error.message = "请求错误";
        break;
      case 401:
        error.message = "未授权，请登录";
        break;
      case 403:
        error.message = "拒绝访问";
        break;
      case 404:
        error.message = `请求地址出错: ${error.config.url}`;
        break;
      case 408:
        error.message = "请求超时";
        break;
      case 500:
        error.message = "服务器内部错误";
        break;
      case 501:
        error.message = "服务未实现";
        break;
      case 502:
        error.message = "网关错误";
        break;
      case 503:
        error.message = "服务不可用";
        break;
      case 504:
        error.message = "服务未启动";
        break;
      case 505:
        error.message = "HTTP版本不受支持";
        break;
      case 602:
        error.message = "当前时间不允许上报";
        break;
      default:
        error.message = "服务超时";
    }
  } else {
    error = {};
    error.message = "请检查网络是否通畅";
  }
  console.log(error);
  Dialog.alert({
    message: error.message || '',
  }).then(() => {
    if (error.response.status === 401) {
      store.commit("setLoginStatus", false);
      store.commit("setTabActive", "mine");
      return hideLoading()
    }
    hideLoading()
    // on close
  });
}
export default instance;