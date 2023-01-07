function ListNode(val, next) {
  this.val = val
  this.next = next || null
}

function resverse(head) {
  if(!head || !head.next) return head

  var newHead = resverse(head.next)
  head.next.next = head
  head.next = null

  return newHead
}