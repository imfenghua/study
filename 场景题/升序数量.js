function maxContinueOrder(arr) {
  const len = arr.length
  const dp = new Array(len)
  dp[0] = 1
  for (let i = 1; i < len; i++) {
    dp[i] = arr[i] > arr[i - 1] ? dp[i - 1] + 1 : 1
  }

  return Math.max(...dp)
}

function maxDisContinueOrder(arr) {
  const len = arr.length
  const dp = new Array(len).fill(1)
  for (let i = 1; i < len; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] < arr[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }
  console.log(dp)

  return Math.max(...dp)
}
// console.log(maxDisContinueOrder([101, 19, 12, 51, 32, 7, 103, 8]))

function echo() {
  console.log('1')
  let promise = new Promise((resolve) => {
    console.log('2')
    resolve()
  })
  promise.then(() => {
    console.log('3')
  })
  setTimeout(() => {
    console.log('4')
  }, 0)
  console.log('5')
  return 6
}
echo()
console.log('end')