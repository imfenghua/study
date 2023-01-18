// a.b.c
// {
//   a: {
//     b: {
//       c: null
//     }
//   }
// }
function toObject(str) {
  const arr = str.split('.')
  return arr.reduceRight((pre,cur) => {
    return {[cur]: pre || null}
  }, null)
}

console.log(toObject('a.b.c'))