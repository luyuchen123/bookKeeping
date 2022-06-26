import myAxios from "./myAxios";
class myResponse {
  static $response: myResponse;
  get(url: string, callback?: ICallBack, config?: any) {
    myAxios.get(url, config).then((res: any) => {
      callback && callback(
        !!res.errStatus,
        res.data
      )
    }).catch(err => {
      callback && callback(
        err
      )
    })
  }
  post(url: string, params: any, callback?: ICallBack, config?: any) {
    myAxios.post(url, params, config).then((res: any) => {
      callback && callback(
        !!res.errStatus,
        res.data
      )
    }).catch(err => {
      callback && callback(
        err
      )
    })
  }
}
if (!myResponse.$response) {
  myResponse.$response = new myResponse();
}
export default myResponse.$response