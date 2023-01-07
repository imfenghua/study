// {
//   tag: 'DIV',
//   attrs:{
//   id:'app'
//   },
//   children: [
//     {
//       tag: 'SPAN',
//       children: [
//         { tag: 'A', children: [] }
//       ]
//     },
//     {
//       tag: 'SPAN',
//       children: [
//         { tag: 'A', children: [] },
//         { tag: 'A', children: [] }
//       ]
//     }
//   ]
// }

function vdomTransfer(vnode) {
  // 如果是数字类型转化为字符串
  // 字符串类型直接就是文本节点
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  const {tag, attrs = {}, children = []} = vnode
  var dom = document.createElement(tag.toLocaleLowerCase())
  if(Object.keys(attrs).length > 0) {
    for(let key in attrs) {
      dom.setAttribute(key, attrs[key])
    }
  }
  if(children.length > 0) {
    children.forEach(child => {
      dom.appendChild(vdomTransfer(child))
    })
  }
  return dom
}