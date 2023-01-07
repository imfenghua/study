// 全局 effect 栈
const effectStack = [];
// 当前激活的 effect
let activeEffect;

function effect(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    // 如果 fn 已经是一个 effect 函数了，则指向
    fn = fn.raw;
  }
  // 创建一个 wrapper，它是一个响应式的副作用的函数
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    // lazy 配置，计算属性会用到，非 lazy 则直接执行一次
    effect();
  }

  return effect;
}

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effect.active) {
      // 非激活状态，则判断如果非调度执行，则直接执行原始函数
      return options.scheduler ? undefined : fn();
    }

    if (!effectStack.includes(effect)) {
      // 清空 effect 引用的依赖
      cleanup(effect);

      try {
        // 开启全局 shouldTrack，允许依赖收集
        enableTracking();
        // 压栈
        effectStack.push(effect);
        activeEffect = effect;
        // 执行原始函数
        return fn();
      } finally {
        // 出栈
        effectStack.pop();
        // 恢复 shouldTrack 开启之前的状态
        resetTracking();
        // 指向栈最后一个 effect
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };

  effect.id = uid++;
  // 标识是一个 effect 函数
  effect._isEffect = true;
  // effect 自身的状态
  effect.active = true;
  // 包装的原始函数
  effect.raw = fn;
  // effect 对应的依赖，双向指针，依赖包含对 effect 的引用，effect 也包含对依赖的引用
  effect.deps = [];
  // effect 的相关配置
  effect.options = options;

  return effect;
}