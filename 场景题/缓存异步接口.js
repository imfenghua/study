/**
 * 缓存异步接口
 * - 第一次请求缓存接口的时候，和调用原异步接口效果一样
 * - 缓存接口根据入参缓存原异步接口返回值
 * - 有缓存值的时候，马上返回缓存值，并发起请求更新缓存值
 * - 对于同样的入参，缓存接口同一时刻，最多只会发起一个请求
 * @param fn 原异步接口
 * @returns 缓存接口
 */

function cacheApi(fn) {
  const map = new Map();
  return async (key) => {
    const cached = map.get(key);
    if(cached) {
      if(cached.pending) {
        return cached
      } else {
        const nextPromise = fn(key);
        nextPromise.finally(() => {
          map.set(key, nextPromise);
        })
        cached.pending = true
        return cached
      }
    } else {
      const promise = fn(key)
      promise.pending = true;
      map.set(key, promise);
      promise.finally(() => {
        promise.pending = false;
      })
      return promise;
    }


  }
}

const mockApi = (() => {
  let id = 0
  return async (req) => {
    await new Promise((r) => setTimeout(r, 1000))
    return {
      req,
      id: id++,
    }
  }
})()

/**
 * 缓存的接口
 */
const cachedApi = cacheApi(mockApi);

(async () => {
  console.log('111',
    await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')]))
  // 一秒钟后输出 [ { req: "a", id: 0 }, { req: "b", id: 1 }, { req: "a", id: 0 } ]

  console.log(
    await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')]),
  )
  // 马上输出 [ { req: "a", id: 0 }, { req: "b", id: 1 }, { req: "a", id: 0 } ]

  await new Promise((r) => setTimeout(r, 1000))
  console.log(
    await Promise.all([cachedApi('a'), cachedApi('b'), cachedApi('a')]),
  )
  // 马上输出 [ { req: "a", id: 2 }, { req: "b", id: 3 }, { req: "a", id: 2 } ]
})()