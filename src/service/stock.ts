import isapi from './isapi';
let URLS = {
  ADDSTOCKITEM: `/ISAPI/Stock/AddItem`,
  EDITSTOCK: `/ISAPI/Stock/EditItem`,
  GETLIST: `/ISAPI/Stock/list`,
  DELTESTOCKITEM: `/ISAPI/Stock/DeleteItem?id=%s`
}
export default {
  addItem(params: IStockItem, callback: ICallBack) {
    return isapi.post(
      URLS.ADDSTOCKITEM,
      {
        stockRequset: { ...params }
      },
      callback
    );
  },
  editItem(params: any, callback?: ICallBack) {
    return isapi.post(
      URLS.EDITSTOCK,
      {
        stockRequset: { ...params }
      },
      callback
    );
  },
  deleteItem(id: string, callback?: ICallBack) {
    return isapi.get(URLS.DELTESTOCKITEM.replace("%s", id), callback);
  },
  getList(params: any, callback: ICallBack) {
    return isapi.post(
      URLS.GETLIST,
      {
        stockRequset: { ...params }
      },
      callback
    );
  }
}