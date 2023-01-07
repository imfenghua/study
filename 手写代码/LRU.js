class LRUCache {
  constructor(length) {
    this.len = length
    this.map = new Map()
  }


  get(key) {
    if(!this.map.has(key)) return null
    var value = this.map.get(key)
    this.map.delete(key)
    this.map.set(key, value)
    return value
  }

  set(key, value) {
    if(this.map.has(key)) {
      this.map.delete(key)
    } else {
      if(this.map.size === this.len) {
        var firstKey = this.map.keys().next().value
        this.map.delete(firstKey)
      }
    }
    this.map.set(key, value)
  }
}