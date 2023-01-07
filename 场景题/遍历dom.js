function traverse(node) {
  if(node && node.nodeType === 1) {
    console.log(node.tagName);
  }
  const { childNodes } = node
  for(let i = 0; i < childNodes.length; i++) {
    traverse(childNodes[i])
  }
}


// 层序遍历
function traverse(node) {
  const queue = [node]
  while(queue.length) {
    for(let i = 0; i < queue.length; i++) {
      const cur = queue.shift()
      if(cur && cur.nodeType === 1) {
        console.log(cur.tagName);
        const { childNodes } = cur
        for(let j = 0; j < childNodes.length; j++) {
          queue.push(childNodes[j])
        }
      }
    }
  }
}