class TrafficLight {
  constructor(initLight) {
    this.light = 0
    this.state = initLight
  }
  next() {
    this.light = (this.light + 1) % 3
    this.start()
  }

  start() {
    const { color, time } = this.state[this.light]
    console.log(color)
    this.timer = setTimeout(() => {
      this.next()
    }, time * 1000)
  }

  stop() {
    clearTimeout(this.timer)
  }
}

const trafficLight = new TrafficLight([
  {
    color: 'red',
    time: 3
  },
  {
    color: 'yellow',
    time: 1
  },
  {
    color: 'green',
    time: 2
  }
])

trafficLight.start()
