declare interface Ical {
  amount: number,
  timestap: string,
  remarks?: string
}
declare interface IbookKeepingItem extends Ical {
  _id: string,
  _type: number,
  _bookkeepingType: string
}
declare interface ItypeList {
  _id: string,
  iconClass: string,
  name: string
}

declare interface IList {
  time: string,
  income: number,
  pay: number,
  REList: IreList[]
}
declare interface IreList {
  _id: string,
  iconClass: string,
  remarks: string,
  amount: number,
  iconId?: string,
  type?: number
}