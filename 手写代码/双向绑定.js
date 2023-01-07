// 有一个span, input，里面数据同步
var data = {
  text: '111'
}

var input = document.getElementsByTagName('input')[0]
var span = document.getElementsByTagName('span')[0]

// Object.defineProperty(data, 'text', {
//   set: (val) => {
//     data.text = val
//     span.innerHTML = val
//     input.value = val
//   }
// })
const handler = {
  set(target, key, value) {
    Reflect.set(target, key, value)
    span.innerHTML = val
    input.value = val
  }
}
var proxy = new Proxy(data, handler)

input.addEventListener('change', (e)=> {
  proxy.text = e.target.value
})