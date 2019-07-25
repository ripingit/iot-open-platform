/**
 * 在上传中不能通过文件后缀来判断文件格式是否正确，应该采取MIME来判断，MIME更严谨
 * 在界面提示时应将MIME类型转换为后缀
 */

const mime = {
  "image/jpeg"                                                       : "jpeg、jpg",
  "image/png"                                                        : "png",
  "image/bmp"                                                        : "bmp",
  "image/gif"                                                        : "gif",
  "application/vnd.ms-excel"                                         : "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.android.package-archive"                          : "apk"
}

export default function (mimeList) {
  if (mimeList instanceof Array) {
    const arr = []
    mimeList.forEach(item => {
      arr.push(mime[item])
    })
    return arr.join("、")
  }
  return ""
}
