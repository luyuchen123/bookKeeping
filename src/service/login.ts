import isapi from "./isapi";
let URLS = {
  LOGIN: `/ISAPI/USER/LOGIN`,
  TEST: `/ISAPI/USER/TEST`,
  REGISTER: `/ISAPI/USER/REGISTER`,
  USERDETAIL: `/ISAPI/USER/USERDETAIL`,
  VALIDATESVG: `/ISAPI/USER/VERLIDATECODE`,
  LOGINOUT: `/ISAPI/USER/LOGINOUT`,
  TOKENREFRESH: `/ISAPI/USER/TOKENREFRESH`,
};
export default {
  goTest(callback: ICallBack) {
    return isapi.get(URLS.TEST, callback);
  },
  onAccessTokenFetched(callback: ICallBack) {
    return isapi.get(URLS.TOKENREFRESH, callback);
  },
  goLogin(params: Ilogin, callback: ICallBack) {
    return isapi.post(
      URLS.LOGIN,
      {
        LoginRequest: {
          ...params,
        },
      },
      callback
    );
  },
  goRegister(params: IRegister, callback: ICallBack) {
    return isapi.post(
      URLS.REGISTER,
      {
        RegisterRequest: {
          ...params,
        },
      },
      callback
    );
  },
  getUserDetail(callback: ICallBack) {
    return isapi.get(URLS.USERDETAIL, callback);
  },
  setUserDetail(params: any, callback: ICallBack) {
    return isapi.post(URLS.USERDETAIL, params, callback, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
  },
  //获取图形验证码
  // getSvg(callback) {
  //   return isapi.get(URLS.VALIDATESVG, callback);
  // },
  // //获取手机验证码
  // getPhone(params, callback) {
  //   return isapi.post(URLS.VALIDATESVG, params, callback);
  // },
  // loginOut(callback) {
  //   return isapi.get(URLS.LOGINOUT, callback);
  // }
};
