// 测试
// function multiFn(a, b, c) {
//   return a * b * c;
// }

// var multi = curry(multiFn);

// multi(2)(3)(4);
// multi(2,3,4);
// multi(2)(3,4);
// multi(2,3)(4)

function curry(fn, ...arg1) {
  var len = fn.length
  return function(...arg2) {
    var param = [...arg1, ...arg2]
    if(param.length === len) {
      return fn.apply(this, param)
    } else {
      return curry(fn, ...param)
    }
  }
}


// 实现如下add函数
// add(1); 			// 1
// add(1)(2);  	// 3
// add(1)(2)(3)；// 6
// add(1)(2, 3); // 6
// add(1, 2)(3); // 6
// add(1, 2, 3); // 6

function add(...args) {
  // 在内部声明一个函数，利用闭包的特性保存并收集所有的参数值
  let fn = function(...newArgs) {
   return add.apply(null, args.concat(newArgs))
  }

  // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  fn.toString = function() {
    return args.reduce((total,curr)=> total + curr)
  }

  return fn
}