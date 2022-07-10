import axios, { AxiosResponse } from "axios";
import Storage from "@/util/storage";
import store from "@/store";
import { Dialog } from "vant";
import service from "@/service/login";
import router from "@/router";
const instance = axios.create();
instance.defaults.timeout = 30 * 1000;
instance.defaults.withCredentials = true;
let timer: any = null;
// instance.defaults.headers.common['Authorization'] = Storage.get("token") || "";
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (Storage.get("token")) {
      (config.headers as any).Authorization = Storage.get("token") || "";
    }
    store.commit("changeLoading", true);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    store.commit("changeLoading", true);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    store.commit("setTokenRefreshFlag", false);
    hideLoading();
    return getError(response);
  },
  async (error) => {
    hideLoading();
    // 对响应错误做点什么
    return Promise.reject(await getErrorCode(error));
  }
);

function hideLoading() {
  // if (timer) {
  //   clearTimeout(timer);
  //   timer = null;
  // }
  // timer = setTimeout(() => {
  //   if (timer) {
  //     clearTimeout(timer);
  //     timer = null;
  //   }
  store.commit("changeLoading", false);
  // }, 500);
}

export function getError(res: AxiosResponse<any, any>) {
  // console.log(res);
  //错误码不为零说明有错误，显示错误信息
  if (res.data.errorCode) {
    Dialog.alert({
      message: res.data.message || "",
    }).then(() => {
      // on close
    });
    return { errStatus: true, data: {} };
  }
  return { errStatus: false, data: res.data };
}

function getErrorCode(error: { response?: any; message?: any; config?: any }) {
  return new Promise((resolve) => {
    //根据服务器错误码显示错误信息
    if (error && (error as any).code !== "ECONNABORTED") {
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
    } else if ((error as any).code === "ECONNABORTED") {
      error = {};
      (error as any).code = 131417;
      error.message = "请求异常，请刷新页面";
    } else {
      error = {};
      error.message = "请检查网络是否通畅";
    }

    //本来有签发token的情况 无痛刷新token
    if (error.response?.status === 401 && Storage.get("token")) {
      //考虑多并发请求的情况， 只刷新第一次请求的，其他的忽略
      if (!store.state.tokenRefreshFlag) {
        store.commit("setTokenRefreshFlag", true);
        service.onAccessTokenFetched((errStatus, res) => {
          store.commit("setTokenRefreshFlag", !!errStatus);
          if (errStatus) {
            router.push("/");
            store.commit("setLoginStatus", false);
            store.commit("setTabActive", "mine");
          } else {
            Storage.set("token", "Bearer " + res?.LoginResponse?.token);
          }
          resolve(!errStatus ? "resetOK" : "resetFail");
        });
        return;
      }
      store.commit("setTokenRefreshFlag", true);
      resolve("inRefresh");
      return;
    }

    Dialog.alert({
      message: error.message || "",
    }).then(() => {
      if (error?.response?.status === 401) {
        store.commit("setLoginStatus", false);
        store.commit("setTabActive", "mine");
      }
      if ((error as any).code === 131417) {
        window.location.reload();
      }
      return resolve(error);
      // on close
    });
  });
}
export default instance;
