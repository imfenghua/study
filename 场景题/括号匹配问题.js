// ${{(3+5)*2+(5/(24)}
// 输出： {
//     1: '{',
//     11: '(',
// }

function checkBrackets(str) {
  const stack = []
  const len = str.length
  let res = {}
  const map = {
    "{" : "}",
    "(" : ")"
  }

  for(let i = 0; i < len; i++) {
    if(map[str[i]]) {
      stack.push({
        [i]: str[i]
      })
    } else if( Object.values(map).includes(str[i])) {
      if(stack.length === 0) {
        res[i] = str[i]
      } else {
        let top = stack.pop()
        while(top && map[Object.values(top)[0]] !== str[i]) {
          if(map[Object.values(top)[0]] === str[i]) break
          res = {
            ...res,
            ...top
          }
          top = stack.pop()

        }
      }
    }
  }

  return stack.reduce((pre, cur) => {
    return {
      ...pre,
      ...cur
    }
  }, res)
}

console.log(checkBrackets('${{(3+5)*2+(5/(24)}'))
console.log(checkBrackets('[a+b]/${x}'))