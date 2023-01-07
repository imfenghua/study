function toThousands1(num) {
  const splitArr = String(num).split('.')
  const frontNum = splitArr[0]
  const xiaoshu = splitArr[1].length > 0 ? '.' + splitArr[1] : ''
  let mod = frontNum.length % 3
  const arr = []
  arr.push(frontNum.substring(0, mod))
  while(mod < frontNum.length) {
    arr.push(frontNum.substring(mod, mod + 3))
    mod += 3
  }
  const res = arr.join(',')+ xiaoshu
  return res
}

console.log(toThousands1(13333111122.22))