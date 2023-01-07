function strTransferNum(str) {
  let len = str.length
  let sum = 0
  for(let i = 0; i < len; i++) {
    sum += str[i]*(10**(len-1-i))
  }
  return sum
}

function add(str1, str2) {
  let res = '', temp = 0
  // return strTransferNum(str1)+strTransferNum(str2)
  let a = str1.length, b = str2.length
  while( a || b) {
    if(a) {
      temp += +str1[--a]
    }
    if(b) {
      temp += +str2[--b]
    }

    res = temp %10 + res
    temp = temp > 9 ? 1 : 0
  }
  if(temp === 1) {
    res = 1+res
  }
  return res

}

// console.log(add('111','2222'))

function test(arr) {
  const res = []
  let len = arr.length
  for(let i = 0; i < len;i++) {
    const cur = arr[i]
    let right = i+1
    while(right < len) {
      if(arr[right] > cur) {
        res[i] = arr[right]
        break
      } else {
        right++
      }
    }
    if(right === len) {
      res[i] = -1
    }
  }
  return res
}

console.log(test([2,1,2,4,3]))