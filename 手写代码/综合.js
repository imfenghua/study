function getValue(target, valuePath, defaultValue) {
  var path = valuePath.replace(/\[/g, '.').replace(/\]/g, '.')
  var pathArr = path.split('.').filter((item => item))
  const res = pathArr.reduce((pre,cur) => {
    return pre[cur]
  }, target)

  return res ? res : defaultValue
}

// 版本号排序的方法
// 题目描述:有一组版本号如下 ['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']。
//现在需要对其进行排序，排序的结果为 ['4.3.5','4.3.4.5','2.3.3','0.302.1','0.1.1']
function sort(arr) {
  arr.sort((a,b) => {
    var arr1 = a.split('.')
    var arr2 = b.split('.')
    var index = 0
    while(true) {
      const s1 = arr1[index]
      const s2 = arr2[index]
      index++
      if(s1 === undefined || s2 === undefined) {
        return s1.length - s2.length
      }

      if(s1 ===s2) continue

      return s1-s2
    }
  })
  return arr
}

function dom2Json(node) {
  let root = {}
  root.tag = node.nodeName
  if(node.children && node.children.length > 0) {
    root.children = []
    node.children.forEach(child => {
      root.children.push(dom2Json(child))
    });
  }
  return root
}