function equal(a, b) {
  if(a === b) {
    return a!==0 || 1/a === 1/b
  } else {
    return isNaN(a) && isNaN(b)
  }
}

console.log(equal(0, -0))
console.log(equal(NaN, NaN))
console.log(equal({a: 1}, {a: 1}))