// 求出一个二维数组[[A, B], [a, b], [1, 2]]所有排列组合
// 输入[[A, B], [a, b], [1, 2]]
// 输出[Aa1, Aa2, Ab1, Ab2, Ba1, Ba2, Bb1, Bb2]
function getAllCombinations(arr) {
  const result = [];
  const len = arr.length;
  function dfs(index, temp) {
    if (index === len) {
      result.push(temp);
      return;
    }
    for (let i = 0; i < arr[index].length; i++) {
      dfs(index + 1, temp + arr[index][i]);
    }
  }
  dfs(0, '');
  return result;
}

// console.log(getAllCombinations([['A', 'B'], ['a', 'b'], ['1', '2']]));


function Foo() {
  Foo.prototype.a = function () {
    console.log(1)
  }
  this.a = function () {
    console.log(2)
  }
}
Foo.a = function () {
  console.log(3)
}
Foo.prototype.a = function () {
  console.log(4)
}
Foo.a() // 3
let obj = new Foo()
obj.a() // 2
Foo.prototype.a() //1 在new的时候被重写了

function test(arr, target) {
  let result = []
  let sum = 0
  let track = []
  let len = arr.length
  const backTrack = (arr, start) => {
    if(sum === target && track.length === 2) {
      result.push([...track])
    }
    for(let i = start; i< len ; i++) {
      track.push(i)
      sum += arr[i]
      backTrack(arr, i+1)
      track.pop()
      sum -= arr[i]
    }
  }
  backTrack(arr,0)
  return result
}


function createRepeat(callBack, repeat, interval) {
  let timer
  let count = repeat
  return (arg) => {
    timer = setInterval(() => {
      count--
      if(count <= 0) {
        clearInterval(timer)
      }
      callBack(arg)
    }, interval*1000);
  }
}

const fn = createRepeat(console.log, 3, 4)
fn('hello')