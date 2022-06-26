declare interface IStockDetail {
  _stockNum: number,
  buyingPrice: number,
  remarks?: string,
  timestap: string
}
declare interface IStockEditDetail extends IStockDetail {
  _id: string
}
declare interface IStockItem extends IStockDetail {
  _id: string,
  _stockType: string,
  sellPrice?: number
}
declare type IaxoisStockData = {
  Inwarehouse: number
  finished: boolean
  list: any
  profit: number
}