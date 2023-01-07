function useRef(initialValue) {
  let hook
  if(isMount) {
    hook = mountWorkInProgressHook()
    var ref = {current: initialValue}
    hook.memoizedState = ref
    return ref
  } else {
    hook = UpdateWorkInProgressHook()
    return hook.memoizedState
  }
}

// ref的执行过程分两步：
// 1. 在rend阶段为发生变更的节点添加ref的effectTag(beginWork, completeWork里有一个同名的markRef函数)
// beiginWork中的
function markRef(current, workInProgress) {
  var ref = workInProgress.ref
  if((current === null && ref !== null) || (current !== null && current.ref !== ref)) {
    workInProgress.effectTag = Ref
  }
}

// completeWork中的
function markRef(workInProgress) {
  workInProgress.effectTag = Ref
}
// 2. 在commit-mutation阶段删除原来老的ref
function commitMutationEffects() {
  while(nextEffect !== null) {
    const tag = nextEffect.effectTag

    if(tag === 'Ref') {
      const current = nextEffect.alternate
      if(current !== null) {
        const ref = current.ref
        if(ref !== null) {
          if(typeof ref === 'function') {
            ref(null)
          } else {
            ref.current = null
          }
        }
      }
    }

    nextEffect = nextEffect.nextEffect
  }
}

// 3. 在commit-layout阶段添加新的ref
function commitAttachRef(finishedWork) {
  const ref = finishedWork.ref
  if(ref !== null) {
    var instance = finishedWork.stateNode
    let instanceToUse
    switch(finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance)
        break
      default:
        instanceToUse = instance
    }

    if(typeof ref === 'function') {
      ref(instanceToUse)
    } else {
      ref.current = instanceToUse
    }
  }
}
