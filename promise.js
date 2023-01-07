// 手写promise.all
Promise.all = function (promises) {
  var arr = []
  return new promise((resolve, reject) => {
    for(var i = 0; i < promises.length; i++) {
      promises[i].then((data)=> {
        arr[i] = data;
        if(arr.length === promises.length) {
          resolve(arr)
        }
      }, reject)
    }
  })
};

Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    var res = []
    for(var i = 0; i < promises.length; i++) {
      promises[i].then((data) => {
        res[i] = {
          status: 'fulfilled',
          value: data
        }
      }, (reason) => {
        res[i] = {
          status: 'rejected',
          reason
        }
      }).finally(() => {
        if(res.length === promises.length) {
          resolve(res)
        }
      })
    }
  })
};

Promise.race = function (promises) {
  return new Promise((reslove, reject)=> {
    promises.forEach(promise => {
      promise.then((data)=> {
        reslove(data)
      }, (reason)=> {
        reject(reason)
      })
    });
  })
}


function MyPromise(execute) {
  this.status = 'pending'
  this.value = undefined
  this.fulfilledCallbackQueue = []
  this.rejectCallbackQueue = []

  try {
    execute(this.reslove, this.reject)
  } catch(e) {
    this.reject(e)
  }
}

MyPromise.prototype.reslove = function(value) {
  if(this.status === 'pending') {
    this.status === 'fulfilled'
    this.value = value

    while(this.fulfilledCallbackQueue.length) {
      this.fulfilledCallbackQueue.shift()(value)
    }
  }
}

MyPromise.prototype.reject = function(reason) {
  if(this.status === 'pending') {
    this.status === 'rejected'
    this.value = reason

    while(this.rejectCallbackQueue.length) {
      this.rejectCallbackQueue.shift()(value)
    }
  }
}

MyPromise.prototype.then = function(resloveCallback, rejectCallBack) {

  const thenPromise = new MyPromise((reslove,rej) => {
    const reslovePromise = cb => {
      try {
        const result = cb(this.value)
        if (result === thenPromise) {
          // 不能返回自身哦
          throw new Error('不能返回自身。。。')
      }
        if(result instanceof MyPromise) {
          result.then(reslove, rej)
        } else {
          reslove(result)
        }
      } catch(e) {
        rej(e)
      }

    }

    if(this.status === 'pending') {
      this.fulfilledCallbackQueue.push(resloveCallback.bind(this))
      this.rejectCallbackQueue.push(rejectCallBack.bind(this))
    }else if(this.status === 'fulfilled') {
      reslovePromise(resloveCallback)
    }else if(this.status === 'rejected') {
      reslovePromise(rejectCallBack)
    }

  })

  return thenPromise
}
