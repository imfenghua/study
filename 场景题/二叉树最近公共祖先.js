// var lowestCommonAncestor = function(root, p, q) {
//   let parent1 = getAncestor(root, p)
//   let parent2 = getAncestor(root, q)
//   const commonParent = parent1.filter(item => parent2.includes(item))
//   return commonParent[commonParent.length - 1]
// };

// let getAncestor = function(root, p) {
//   let parents = []
//   const traverse = function(root, track) {
//       if(!root) return
//       track.push(root.val)
//       if((root.left && root.left.val === p) || (root.right && root.right.val === p)) {
//           parents.push(...track)
//           return
//       }
//       traverse(root.left, [...track])
//       traverse(root.right, [...track])
//   }
//   traverse(root, [])
//   parents.push(p)
//   return parents
// }
const lowestCommonAncestor = function(root, p, q) {
  if(!root) return null
  if(root.val === p || root.val === q) return root
  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)
  if(left && right) return root
  return left || right
}

const tree = {
  val: 1,
  left: {
    val: 2,
    left: null,
    right: null
  },
  right: null
}

console.log(lowestCommonAncestor(tree, 1, 2))