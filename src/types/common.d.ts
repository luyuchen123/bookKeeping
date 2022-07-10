declare interface ICallBack {
  (errStatus: boolean, res?: any): void;
}
declare interface IAxoisResponse {
  data: any;
  errStatus: number;
}
declare interface Ifile {
  file?: any;
  content?: string;
}
declare interface Ilogin {
  UserName: string;
  Password: string;
}
declare interface IRegister {
  UserName: string;
  Password: string;
}
declare interface IUserDetail {
  UserName: string;
  Phone: string;
  backgroundImage: string;
  headPortraitImage: string;
  isOpenStock: boolean;
}

interface Iicon {
  _id?: string;
  name: string;
  iconClass: string;
}

// declare interface IAxiosUserDetail extends IUserDetail {
//   UserName: string,
//   Phone?: string,
//   backgroundImage?: Ifile[],
//   headPortraitImage?: Ifile[],
//   isOpenStock: boolean,
//   Password?: string,
//   sms?: string
// }
