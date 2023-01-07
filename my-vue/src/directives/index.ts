import DOMPurify from 'dompurify';
// 定义一个指令 用于过滤xss
export const filterHtml = {
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding) {
    // 获取到传递的值
    const { value } = binding;
    // 判断是否是字符串
    if (typeof value === 'string') {
      // 过滤xss
      el.innerHTML = DOMPurify.sanitize(value);
    }
  },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding) {
    const { value } = binding;
    if (typeof value === 'string') {
      el.innerHTML = DOMPurify.sanitize(value);
    }
  },
  beforeUpdated(el, binding) {
    const { value } = binding;
    if (typeof value === 'string') {
      el.innerHTML = DOMPurify.sanitize(value);
    }
  },
  // 绑定元素的父组件更新前调用
  updated(el, binding) {
    const { value } = binding;
    if (typeof value === 'string') {
      el.innerHTML = DOMPurify.sanitize(value);
    }
  }
}