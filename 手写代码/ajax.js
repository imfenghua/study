function myRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    var requestUrl = url
    if(method.toLocaleLowerCase() === 'get') {
      var queryArr =[]
      for(let key in data) {
        var str = `${key}=${data[key]}`
        queryArr.push(str)
      }
      requestUrl = `${url}?${queryArr.join('&')}`
    }

    xhr.open(method, requestUrl)
    if(method.toLocaleLowerCase() === 'post') {
      xhr.send(data)
    } else {
      xhr.send()
    }

    xhr.onreadystatechange = ()=> {
      if(xhr.readyState === 4) {
        if(xhr.status >=200 && xhr.status < 300) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.status)
        }
      }
    }
  })

}