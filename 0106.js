function debounce(fn, wait, immediately) {
  let timer = null;

  const debounced = function(...args) {
    if(timer) {
      clearTimeout(timer);
    }

    if(immediately) {
      if(!timer) {
        fn.apply(this, args);
      }
      timer = setTimeout(() => {
        timer = null
      }, wait)
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null
  }

  return debounced
}

// const fn = debounce(click, 1000, true)

// abc_def
//AbcDef
function transfer(str) {
  // const arr = str.split('_');
  // return arr.map(item => {
  //   return item[0].toUpperCase() + item.slice(1)
  // }).join('')
  return str.replace(/(_\w)/g, (v) => {
    return v.substring(1).toUpperCase()
  })
}
console.log(transfer('abc_def'))

class LRU {
  constructor(size) {
    this.maxSize = size
    this.map = new Map()
  }

  get(key) {
    const value = this.map.get(key)
    if(value) {
      this.map.delete(key)
      this.map.set(key, value)
      return value
    } else {
      throw new Error('not found')
    }
  }

  put(key, value) {
    if(this.map.has(key)) {
      this.map.delete(key)
    } else if(this.map.size >= this.maxSize) {
      this.map.delete(this.map.keys().next().value)
    }
    this.map.set(key,value)
  }
}


function flat(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur)
  }, [])
}

console.log(flat([1,2,3,[1,2,[1,2]]]))


