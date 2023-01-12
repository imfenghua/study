// 'abcaakjbb' => {'a':2,'b':2}
// 'abbkejsbcccwqaa' => {'c':3}

function continueMaxStr(str) {
  let obj = {}
  let max = 1
  let count = 1
  for(let i = 0; i < str.length - 1; i++) {
    if(str[i+1] === str[i]) {
      count ++
      if(count > max) {
        max = count
        obj = {
          [str[i]]: max
        }
      } else if(count === max) {
        obj = {
          ...obj,
          [str[i]]: max
        }
      }
    } else {
      count = 1
    }
  }
  return obj
}
const res = continueMaxStr('abcaakjbb')
console.log(res)