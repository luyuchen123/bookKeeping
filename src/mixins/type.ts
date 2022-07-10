import service from "@/service/bookKeeping";
function deleteIconType(_id: string, callback: ICallBack): void {
  service.delType(_id, callback);
}

export default { deleteIconType };
