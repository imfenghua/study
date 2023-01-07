/**
 * 根据表达式计算字母数
 * 说明：
 *   给定一个描述字母数量的表达式，计算表达式里的每个字母实际数量
 *   表达式格式：
 *     字母紧跟表示次数的数字，如 A2B3
 *     括号可将表达式局部分组后跟上数字，(A2)2B
 *     数字为1时可缺省，如 AB3。
 * 示例：
 *   countOfLetters('A2B3'); // { A: 2, B: 3 }
 *   countOfLetters('A(A3B)2'); // { A: 7, B: 2 }
 *   countOfLetters('C4(A(A3B)2)2'); // { A: 14, B: 4, C: 4 }
 */
function countOfLetters(str) {
  const stack = []
  const len = str.length
  for(let i = 0; i< len; i++) {
    const currentStr = str[i]
    if(currentStr === '(') {
      stack.push({})
    } else if(currentStr === ')') {
      const innerObj = stack.pop()
      const n = str[i+1] ? parseInt(str[i+1]) : 1
      innerObj && Object.keys(innerObj).forEach(key => {
        innerObj[key] = innerObj[key] * n
      })
      const lastObj = stack[stack.length - 1]
      if(lastObj) {
        Object.keys(innerObj).forEach(key => {
          lastObj[key] = (lastObj[key] || 0) + innerObj[key]
        })
      } else {
        stack.push(innerObj)
      }
      i++
    } else if(currentStr >= 'a' && currentStr <= 'z') {
      if(stack.length === 0) {
        stack.push({})
      }
      const lastObj = stack[stack.length - 1]
      lastObj[currentStr] = lastObj[currentStr] ? lastObj[currentStr] + 1 : 1
    } else {
      const lastObj = stack[stack.length - 1]
      for(let key in lastObj) {
        lastObj[key] = lastObj[key] * currentStr
      }
    }
  }
  return stack
}

countOfLetters('A2B3'); // { A: 2, B: 3 }
// countOfLetters('A(A3B)2'); // { A: 7, B: 2 }
// countOfLetters('C4(A(A3B)2)2'); // { A: 14, B: 4, C: 4 }