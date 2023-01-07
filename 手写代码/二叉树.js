class Node {
  constructor(val, left, right) {
    this.val = val
    this.left = left
    this.right = right
  }
}

// 前序遍历
// 中序遍历
// 后序遍历
//res.push(root.val)位置不一样
function orderTraversal(root) {
  var res = []
  var sort = (root) => {
    if(!root) return
    res.push(root.val)
    sort(root.left)
    sort(root.right)
  }
  sort(root)
  return res
}
// 层序遍历while+for
function levelOrderTraversal(root) {
  var res = []
  var sort = (root) => {
    var queue = [root]
    while(queue.length) {
      var len = queue.length
      for(var i=0; i < len; i++) {
        var currentNode = queue.shift()
        // 若要进行反转，则在此处进行左右子树交换
        res.push(currentNode.val)
        if(currentNode.left) {
          queue.push(currentNode.left)
        }
        if(currentNode.right) {
          queue.push(currentNode.right)
        }
      }
    }
  }
  sort(root)
  return res
}


// 最大深度
function getMaxDepth(root) {
  var res = 0
  var depth = 0

  var traverse = (root) => {
    if(!root) return
    depth++
    if(root.left === null && root.right === null) {
      res = Math.max(res, depth)
    }
    traverse(root.left)
    traverse(root.right)
  }
}