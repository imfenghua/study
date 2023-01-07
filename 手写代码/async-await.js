function co(gen) {
  if(typeof gen !== 'function') {
    throw new TypeError()
  }
  let it = gen()

  return new Promise((resolve, reject) => {
    try {
      var next = data => {
        const {value, done} = it.next(data)
        if(done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then((data) => {
            next(data)
          })
        }
      }
      next()
    } catch (e) {
      reject(e)
    }
  })
}