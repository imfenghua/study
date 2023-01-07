// 冒泡排序
function bubble(list) {
  var len = list.length
  // 定义每次比较的边界即最后一次发生交换的index
  var sortBorder = len - 1
  var lastExchangeIndex = 0
  for(var i = 0; i< len; i++) {
    var isSorted = true
    for(var j = 0; j< len-i-1; j++) {
      if(list[j] > list[j+1]) {
        var temp = list[j+1]
        list[j+1] = list[j]
        list[j] = temp
        isSorted = false
        lastExchangeIndex = j
      }
    }
    sortBorder = lastExchangeIndex
    // 如果本次循环没有交换过，表明已经是个有序列表，直接跳出循环
    if(isSorted) break
  }

  return list
}

// 插入排序
function insert(list) {
  var len = list.length
  for(var i = 1; i < len; i++) {
    var j = i
    var target = list[j]
    while(j > 0 && list[j-1] > target) {
      list[j] = list[j-1]
      j--
    }
    list[j] = target
  }
  return list
}

// 选择排序
function selectSort(list) {
  var len = list.length
  for(var i = 0; i < len; i++) {
    var min = i
    for(var j = i+1; j < len; j++) {
      if(list[j] < list[min]) {
        min =  j
      }
    }
    var temp = list[min]
    list[min] = list[i]
    list[i] = temp
  }
  return list
}

// 快速排序
function quickSort(list) {
  if(list.length <=1) return list
  var baseIndex = Math.floor(list.length/2)
  var base = list.splice(baseIndex,1)[0]
  var left = []
  var right = []
  for(var i = 0; i < list.length; i++) {
    if(list[i] >= base) {
      right.push(list[i])
    } else {
      left.push(list[i])
    }
  }
  return quickSort(left).concat(base).concat(quickSort(right))
}

// 归并排序
function mergeSort(list) {
  if(list.length <=1) return list
  var mid = Math.floor(list.length/2)
  var leftArr = list.slice(0, mid)
  var rightArr = list.slice(mid)
  return merge(mergeSort(leftArr), mergeSort(rightArr))
}

function merge(arr1, arr2) {
  var res = []
  var len1 = arr1.length, len2 = arr2.length
  var p1 = 0, p2=0
  while(p1 < len1 && p2 < len2) {
    if(arr1[p1] <= arr2[p2]) {
      res.push(arr1[p1])
      p1++
    } else {
      res.push(arr2[p2])
      p2++
    }
  }
  if(p1 < len1) {
    res = [...res, ...arr1.slice(p1)]
  }
  if(p2 < len2) {
    res = [...res, ...arr2.slice(p2)]
  }
  return res
}

// 二分查找
// 前提是一个有序数组
function search(list, target) {
  var left = 0, right = list.length - 1
  while(left <= right) {
    var mid = parseInt(left + (right-left)/2)
    if(list[mid] < target) {
      left = mid+1
    } else if(list[mid] > target) {
      right = mid-1
    } else {
      return mid
    }
  }
}