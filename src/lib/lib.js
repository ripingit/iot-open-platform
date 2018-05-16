/** 倒计时函数
 * @argument { 倒计时分钟数 } time
 */
export function countDown (time) {
  let now = new Date()
  let minutes = now.getMinutes()
  let hours = now.getHours()
  let endTime
  if (minutes + time > 59) {
    hours += 1
  } else {
    
  }
}