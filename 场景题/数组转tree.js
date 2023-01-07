// 源数据
const list = [
  {
    id: 19,
    parentId: 0,
  },
  {
    id: 18,
    parentId: 16,
  },
  {
    id: 17,
    parentId: 16,
  },
  {
    id: 16,
    parentId: 0,
  },
]

// 转换后的数据结构

const tree = {
  id: 0,
  children: [
    {
      id: 19,
      parentId: 0,
    },
    {
      id: 16,
      parentId: 0,
      children: [

        {
          id: 18,
          parentId: 16,
        },
        {
          id: 17,
          parentId: 16,
        },
      ],
    },
  ],
}

/**
 * @param list {object[]},
 * @param parentKey {string}
 * @param currentKey {string}
 * @param rootValue {any}
 * @return object
 */
function convert2(list, parentKey, currentKey, rootValue) {
  const res = {
    [currentKey]: rootValue
  }
  list.forEach(item => {
    if(item[parentKey] === rootValue) {
      res.children = res.children || []
      res.children.push({
        ...item,
        ...convert2(list, parentKey, currentKey, item[currentKey])
      })
    }
  })
  return res

}
const result = convert2(list, 'parentId', 'id', 0)
console.log(result)