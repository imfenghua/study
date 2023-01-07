function getSum(arr, n, target) {
  let res = []
  let sum = 0
  let track = []

  const traverse = (arr, start) => {
    if(sum > target) return
    if(sum === target && track.length === n) {
      console.log([...track])
      res.push([...track])
      return
    }
    for(let i = start; i < arr.length; i++) {
      track.push(arr[i])
      sum += arr[i]
      traverse(arr, i+1)
      track.pop()
      sum -= arr[i]
    }
  }
  traverse(arr, 0)
  return res
}

console.log(getSum([1, 4, 7, 11, 9, 8, 10, 6], 3, 27))