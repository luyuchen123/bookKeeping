import isapi from "./isapi";
let URLS = {
  ADDTYPE: `/ISAPI/BookKeeping/AddType`,
  EDITTYPE: `/ISAPI/BookKeeping/EditType`,
  DELTYPE: `/ISAPI/BookKeeping/delType?id=%s`,
  GETTYPELIST: `/ISAPI/BOOKkeeping/type/list?search=%s&type=%d`,
  ADDAccount: `/ISAPI/BookKeeping/AddItem`,
  EDITACCOUNT: `/ISAPI/BookKeeping/EditItem`,
  GETLIST: `/ISAPI/BookKeeping/list`,
  GETIMAGE: `/ISAPI/BookKeeping/image?imagePath=%s`,
  DELITEM: `/ISAPI/BookKeeping/DeleteItem?id=%s`,
};
export default {
  addItem(params: IbookKeepingItem, callback: ICallBack) {
    return isapi.post(
      URLS.ADDAccount,
      {
        bookKeepingRequset: { ...params },
      },
      callback
    );
  },
  editItem(params: any, callback?: ICallBack) {
    return isapi.post(
      URLS.EDITACCOUNT,
      {
        bookKeepingRequset: { ...params },
      },
      callback
    );
  },
  getList(params: any, callback: ICallBack) {
    return isapi.post(
      URLS.GETLIST,
      {
        bookKeepingRequset: { ...params },
      },
      callback
    );
  },
  addType(params: File, callback: ICallBack) {
    return isapi.post(URLS.ADDTYPE, params, callback, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
  },
  editType(params: File, callback: ICallBack) {
    return isapi.post(URLS.EDITTYPE, params, callback, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
  },
  delType(id: string, callback: ICallBack) {
    return isapi.get(URLS.DELTYPE.replace("%s", id), callback);
  },
  getTypeList(params: any, callback: ICallBack) {
    return isapi.get(
      URLS.GETTYPELIST.replace("%s", params.search).replace("%d", params.type),
      callback
    );
  },
  getImage(path: string, callback?: ICallBack) {
    return isapi.get(URLS.GETIMAGE.replace("%s", path), callback);
  },
  deleteItem(id: string, callback?: ICallBack) {
    return isapi.get(URLS.DELITEM.replace("%s", id), callback);
  },
};
