// s = "abcabcbb"
function lengthOfLongestSubstring(s) {
  if(s.length === 0) return 0
  var left = 0, right = 1
  var res = 1
  while(right < s.length) {

    while(s.slice(left, right).indexOf(s[right]) > -1) {

      left++
    }
    res = Math.max(res, right -left+1)
    right++
  }
  return res
}