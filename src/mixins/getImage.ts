import Storage from "@/util/storage";
export default function () {
  const getTypeIcon = (path: string) => {
    if (/^el-icon-.*/.test(path)) {
      return path;
    }
    return `/ISAPI/BookKeeping/image?imagePath=${path
      }&token=${Storage.get("token")}`
  }
  return {
    getTypeIcon
  }
}
