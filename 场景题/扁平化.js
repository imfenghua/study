/**
 * 对象扁平化
 * 说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
 * 示例：
 *   var input = {
 *     a: 1,
 *     b: [ 1, 2, { c: true }, [ 3 ] ],
 *     d: { e: 2, f: 3 },
 *     g: null,
 *   }
 *   var output = flatten(input);
 *   output如下
 *   {
 *     "a": 1,
 *     "b[0]": 1,
 *     "b[1]": 2,
 *     "b[2].c": true,
 *     "b[3][0]": 3,
 *     "d.e": 2,
 *     "d.f": 3,
 *     // "g": null,  值为null或者undefined，丢弃
 *  }
 */
function flatten(input, prefix = '', res = {}) {
  if(Array.isArray(input) && input.length > 0) {
    input.forEach((item, index) => {
      const currentKey = prefix ? `${prefix}[${index}]` : index
      return flatten(item, currentKey, res)
    })
  } else if(typeof input === 'object' && input !== null) {
    Object.keys(input).forEach(key => {
      const currentKey = prefix ? `${prefix}.${key}` : key
      return flatten(input[key], currentKey, res)
    })
  } else if(input !== null && input !== undefined) {
    res[prefix] = input
  }
  return res
}

var input = {
  a: 1,
  b: [ 1, 2, { c: true }, [ 3 ] ],
  d: { e: 2, f: 3 },
  g: null,
}

console.log(flatten(input))