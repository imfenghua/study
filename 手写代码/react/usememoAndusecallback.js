// mount阶段
function useMemo(callback, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const nextValue = callback()
  hook.memoizaState = [nextValue, nextDeps]
  return nextValue
}

function useCallback(callback, deps) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  hook.memoizaState = [callback, nextDeps]
  return callback
}


// update阶段
function useMemo(callback, deps) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps

  const prevState = hook.memoizaState
  //比较新老依赖是否发生变更
  if(equal(prevState[1], nextDeps)) {
    return prevState[0]
  }
  const nextValue = callback()
  hook.memoizaState = [nextValue, nextDeps]
  return nextValue
}