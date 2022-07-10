import myAxios from "./myAxios";
class myResponse {
  static $response: myResponse;
  static $responseList: any[] = []; //当前请求的数据列表
  static $refreshFlag: boolean = false; //重置token的标志
  static $timer: any = null; //定时循环查询token是否重置成功
  get(url: string, callback?: ICallBack, config?: any) {
    myAxios
      .get(url, config)
      .then((res: any) => {
        callback && callback(!!res.errStatus, res.data);
      })
      .catch(async (err) => {
        const _id = `${new Date().getTime()}_${Math.random()}`;
        console.warn(err);
        if (err === "resetOK") {
          myResponse.$responseList.push({
            type: "get",
            _id,
            url,
            callback,
            config,
          });
          const { a, b } = await myResponse.axiosCacheData(_id);
          callback && callback(a, b);
          myResponse.$refreshFlag = true;

          setTimeout(() => {
            myResponse.$responseList = [];
            clearInterval(myResponse.$timer);
            myResponse.$timer = null;
          }, 1000);
          return;
        } else if (err === "inRefresh") {
          myResponse.$responseList.push({
            type: "get",
            _id,
            url,
            callback,
            config,
          });
          await myResponse.tokenRefresh();
          const { a, b } = await myResponse.axiosCacheData(_id);
          callback && callback(a, b);
          return;
        } else if (err === "resetFail") {
          myResponse.$responseList = [];
          clearInterval(myResponse.$timer);
          myResponse.$timer = null;
        }
        callback && callback(err);
      });
  }
  post(url: string, params: any, callback?: ICallBack, config?: any) {
    myAxios
      .post(url, params, config)
      .then((res: any) => {
        callback && callback(!!res.errStatus, res.data);
      })
      .catch(async (err) => {
        const _id = `${new Date().getTime()}_${Math.random()}`;
        if (err === "resetOK") {
          myResponse.$responseList.push({
            type: "post",
            _id,
            url,
            params,
            callback,
            config,
          });
          const { a, b } = await myResponse.axiosCacheData(_id);
          callback && callback(a, b);
          myResponse.$refreshFlag = true;

          setTimeout(() => {
            clearInterval(myResponse.$timer);
            myResponse.$timer = null;
            myResponse.$responseList = [];
          }, 1000);
          return;
        } else if (err === "inRefresh") {
          myResponse.$responseList.push({
            type: "post",
            _id,
            url,
            params,
            callback,
            config,
          });
          await myResponse.tokenRefresh();
          const { a, b } = await myResponse.axiosCacheData(_id);
          callback && callback(a, b);
          return;
        } else if (err === "resetFail") {
          myResponse.$responseList = [];
          clearInterval(myResponse.$timer);
          myResponse.$timer = null;
        }
        callback && callback(err);
      });
  }
  static axiosCacheData(_id: string): Promise<any> {
    let p = myResponse.$responseList.filter((cache) => cache._id === _id);
    console.warn(p);
    if (p.length) {
      let cache: any = p[0];
      return new Promise((resolve) => {
        if (cache.type === "get") {
          myResponse.$response.get(
            cache.url,
            (a, b) => {
              resolve({ a, b });
            },
            cache.config
          );
        } else {
          myResponse.$response.post(
            cache.url,
            cache.params,
            (a, b) => {
              resolve({ a, b });
            },
            cache.config
          );
        }
      });
    }
    return Promise.resolve({ a: true });
  }
  static tokenRefresh() {
    return new Promise<void>((resolve) => {
      myResponse.$timer = setInterval(() => {
        console.log("wait....");
        if (myResponse.$refreshFlag) {
          resolve();
        }
      }, 500);
    });
  }
}
if (!myResponse.$response) {
  myResponse.$response = new myResponse();
}
export default myResponse.$response;
