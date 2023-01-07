function consoleArr(arr) {
  let res = []
  let col = arr.length, row = arr[0].length
  let up = 0, down = col-1, left = 0, right = row - 1
  while(true) {
    for(let i = left; i<= right; i++) {
      res.push(arr[up][i])
    }
    if(++up > down) break

    for(let i = up; i <= down; i++) {
      res.push(arr[i][right])
    }
    if(--right < left) break
    for(let i = right; i>= left; i--) {
      res.push(arr[down][i])
    }
    if(--down < up) break
    for(let i = down; i >= up; i--) {
      res.push(arr[i][left])
    }
    if(++left > right) break
  }
  return res
}
console.log(consoleArr([[2,5,8],[4,0,-1]]))