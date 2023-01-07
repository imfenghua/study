Promise.prototype.myAll = function (promiseArr) {
  return new Promise((resolve,reject) => {
    let result = []
    if(promiseArr.length === 0) {
      resolve(result)
      return
    }
    for(var i = 0; i < promiseArr.length; i++) {
      Promise.resolve(promiseArr[i]).then((res)=> {
        result.push(res)
        if(result.length === promiseArr.length) {
          resolve(result)
        }
      }, reject)
    }
  })
}

Promise.prototype.myAllsettled = function() {
  return new Promise((resolve,reject) => {
    let result = []
    if(promiseArr.length === 0) {
      resolve(result)
      return
    }
    for(var i = 0; i < promiseArr.length; i++) {
      Promise.resolve(promiseArr[i]).then((res)=> {
        result[i] = {
          status: 'fulfilled',
          value : res
        }
      }, (reason) => {
        result[i] = {
          status: 'rejected',
          reason : reason
        }
      }).finally(() => {
        if(result.length === promiseArr.length) {
          resolve(result)
        }
      })
    }
  })
}

Promise.prototype.myRace = function(promiseArr) {
  return new Promise((resolve,reject) => {
    if(promiseArr.length === 0) {
      return
    }
    for(var i = 0; i < promiseArr.length; i++) {
      Promise.resolve(promiseArr[i]).then((res)=> {
        resolve(res)
        return
      }, (reason) => {
        reject(reason)
        return
      })
    }
  })
}

Promise.prototype.myResolve = function(param) {
  if(param instanceof Promise) return param
  return new Promise((resolve, reject)=> {
    if(param && param.then && typeof param.then === 'function') {
      param.then(resolve,reject)
    } else {
      resolve(param)
    }
  })
}

Promise.prototype.myReject = (param) {
  return new Promise((resolve, reject) => {
    reject(param)
  })
}

Promise.prototype.myFinally = function (callback) {
  return this.then((data)=> {
    return Promise.resolve(callback()).then(() => data)
  }, (err)=>{
    return Promise.resolve(callback()).then(() => {
      throw err
    })
  })
}

function MyPromise(executor) {
  this.status = 'pending'
  this.value = undefined
  this.resolveCallbackQueue = []
  this.rejectCallbackQueue = []

  myResolve = (res) => {
    if(res instanceof MyPromise) {
       return res.then(myResolve, myReject)
    }
    if(this.status === 'pending') {
      this.status = 'fulfilled'
      this.value = res
      while(this.resolveCallbackQueue.length) {
        this.resolveCallbackQueue.shift()(this.value)
      }
    }
  }

  myReject = (reason) => {
    if(this.status === 'pending') {
      this.status = 'rejected'
      this.value = reason

      while(this.rejectCallbackQueue.length) {
        this.rejectCallbackQueue.shift()(this.value)
      }
    }
  }

  try {
    executor(myResolve, myReject)
  } catch(e) {
    myReject(e)
  }

}

MyPromise.prototype.then = function(onresolve, onreject) {
  let resolveCb = typeof onresolve === 'function' ? onresolve : v=>v
  let rejectCb = typeof onreject === 'function' ? onreject : err => {throw new Error(err)}

  let returnPromise = new MyPromise((reslove, reject) => {
    let fn = cb => {
      setTimeout(() => {
        try{
          let result = cb(this.value)
          if(result === returnPromise) {
            throw new Error('不能返回自身')
          }else if(result instanceof MyPromise) {
            result.then(reslove, reject)
          } else {
            reslove(result)
          }
        } catch(e) {
          reject(e)
        }
      }, 0);

    }

    if(this.status === 'pending') {
      this.resolveCallbackQueue.push(fn.bind(this, resolveCb))
      this.rejectCallbackQueue.push(fn.bind(this, rejectCb))
    } else if(this.status === 'fulfilled') {
      fn(resolveCb)
    } else if(this.status === 'rejected') {
      fn(rejectCb)
    }
  })
  return returnPromise
}