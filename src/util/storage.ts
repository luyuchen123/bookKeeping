// 封装操作localstorage本地存储的方法  模块化
class Storage {
  set(key: any, value: any) {
    localStorage.setItem(key, value);
  }
  get(key: any) {
    return localStorage.getItem(key) != 'undefined' ? localStorage.getItem(key) : undefined
  }
  getForIndex(index: number) {
    return localStorage.key(index)
  }
  getKeys() {
    let items = this.getAll()
    let keys = []
    for (let index = 0; index < items.length; index++) {
      keys.push(items[index].key)
    }
    return keys
  }
  getLength() {
    return localStorage.length
  }
  getSupport() {
    return (typeof (Storage) !== 'undefined')
  }
  remove(key: any) {
    localStorage.removeItem(key)
  }
  removeAll() {
    localStorage.clear()
  }
  getAll() {
    let len = localStorage.length // 获取长度
    let arr = new Array(len) // 定义数据集
    for (var i = 0; i < len; i++) {
      // 获取key 索引从0开始
      var getKey:string = String(localStorage.key(i))
      // 获取key对应的值
      var getVal = localStorage.getItem(getKey)
      // 放进数组
      arr[i] = {
        'key': getKey,
        'val': getVal
      }
    }
    return arr
  }
}
export default new Storage();