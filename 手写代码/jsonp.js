function jsonp( {url, params, callback} ) {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script')
    var queryArr =[]
      for(let key in params) {
        var str = `${key}=${params[key]}`
        queryArr.push(str)
      }
    var requestUrl = `${url}?callback=${callback}${queryArr.join('&')}`

    window[callback] = function(data) {
      resolve(data)
      document.body.removeChild(script)
    }
    script.type = 'text/script'
    script.src = requestUrl
    document.body.appendChild(script)
  })
}


// 测试用例
jsonp({
  url: 'http://suggest.taobao.com/sug',
  callback: 'getData',
  params: {
    q: 'iphone手机',
    code: 'utf-8'
  },
}).then(data=>{console.log(data)})