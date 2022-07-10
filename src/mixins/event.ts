import { reactive, ref } from "vue";
/* 
判断是否为向左滑操作
*/
function handlerLeftSlip() {
  // 初始化坐标数据
  const startX = ref(-1);
  const endX = ref(-1);
  const isShow = ref(false);
  let optMap = new Map();
  const touchStart = (ev: TouchEvent) => {
    // let _id = getItemId(ev);
    // if (_id && ev.touches.length == 1) { //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
    //   startX.value = ev.touches[0].clientX; // 记录开始位置
    //   // optMap.set(_id, startX.value);
    // }
  };
  const touchEnd = (ev: TouchEvent) => {
    // let _id = getItemId(ev);
    // console.log(_id, optMap)
    // if (_id && ev.changedTouches.length == 1) {
    //   endX.value = ev.changedTouches[0].clientX;
    //   optMap.set(_id, !!(startX.value - endX.value > 50));
    // }
  };
  const getItemId = (ev: any): string => {
    // let time = 0;
    // let _id = ev?.target?.attributes?._id ?? '';
    // if (!_id) {
    //   ev = ev?.target?.parentElement;
    //   _id = ev?.attributes?._id?.value ?? '';
    // }
    // while (time++ < 2) {
    //   if (_id) {
    //     break;
    //   }
    //   ev = ev?.parentElement;
    //   _id = ev?.attributes?._id?.value ?? '';
    // }
    // return typeof _id === 'string' ? (_id === '_id' ? '' : _id) : '';
    return "";
  };
  const judgeLeftShip = (id: string) => {
    console.warn(optMap);
    return optMap.get(id);
  };
  const clearAll = () => {
    optMap.clear();
  };
  return { touchStart, touchEnd, judgeLeftShip, clearAll };
}

/*
判断是否为长按操作
*/
function handlerLongPress() {
  let timer: any = null;
  let startTime: number = 0;
  let cacheId: string;
  const timeDelay = 1000;
  const clickTimeDelay = 0;
  type clickType = "click" | "longPress" | "delIcon" | "editIcon" | "";
  const touchStart = (id: string): void => {
    cacheId = id;
    startTime = new Date().getTime();
    timer = setTimeout(() => {
      startTime = 0;
      clearTimeout(timer);
      timer = null;
    }, timeDelay * 2);
  };
  const touchEnd = (id: string, ev: any): clickType => {
    const endTime = new Date().getTime();
    if (cacheId === id) {
      if (ev.target.className.includes("delIcon")) {
        return "delIcon";
      }

      if (ev.target.className.includes("editIcon")) {
        return "editIcon";
      }

      if (endTime - startTime > timeDelay) {
        if (window.navigator.vibrate) {
          window.navigator.vibrate(1000); //震动
        }
        return "longPress";
      } else if (
        startTime &&
        endTime - startTime <= timeDelay &&
        endTime - startTime >= clickTimeDelay
      ) {
        return "click";
      }
    } else {
      cacheId = "";
      startTime = 0;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    return "";
  };
  return { touchStart, touchEnd };
}

export { handlerLeftSlip, handlerLongPress };
