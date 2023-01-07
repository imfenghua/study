function trans(num) {
  let str = String(num)
  const len = str.length
  let mod = len % 4
  const arr = []
  mod > 0 && arr.push(str.substring(0,mod))
  while(mod < len) {
    arr.unshift(str.substring(mod, mod+4))
    mod += 4
  }
  let res = ''
  const unit = ['','万','亿']
  for(let i = 0; i < arr.length; i++) {
    res = commonTrans(arr[i]) + unit[i] + res
  }
  return res

}

const commonTrans = (str) => {
  const map = {
    0: '零',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九'
  }
  const unit = ['', '十', '百', '千','万','亿']
  let i = str.length-1
  let unitIndex = 0
  let res = ''
  while(i >=0) {
    if(i === str.length-1 && str[i] === '0') {
      res = unit[unitIndex]+res
    } else if(str[i] === '0') {
      res = res.indexOf('零') > -1 ? res : map[str[i]]+res
    } else {
      res = map[str[i]]+unit[unitIndex]+res
    }
    i--
    unitIndex++
  }
  if(str[str.length-1] === '0') {
    res = res.substring(0, res.length-1)
  }
  return res
}
console.log(trans(1234)) //  一千二百三十四
console.log(trans(123456)) // 十二万三千四百五十六
console.log(trans(12345670)) //  一千二百三十四万五千六百七十
console.log(trans(100010001)) // 一亿零一万零一
console.log(trans(10100010001)) //  一百零一亿零一万零一