function co(gen) {
  if(typeof gen !== 'function') return
  return new Promise((reslove, reject) => {
    const fn = gen()
    const dp = (nextValue) => {
      if(nextValue.done) {
        reslove(nextValue.value)
      } else {
        Promise.reslove(nextValue.value).then(res=> {
          dp(fn.next(res))
        })
      }
    }
    dp(fn.next())
  })
}