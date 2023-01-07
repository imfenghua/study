class Subject {
  constructor() {
    this.state = 'hhh'
    this.listeners = []
  }

  add(obj) {
    this.listeners.push(obj)
  }

  setState(value) {
    this.state = value
    this.listeners.forEach(listener => {
      listener.update(this)
    })
  }
}

class Observer {
  constructor(name) {
    this.name = name
  }

  update(subject) {
    console.log('监听到被观察者subject变更', subject.state)
  }
}


let student = new Subject('学生');

let parent = new Observer('父母');
let teacher = new Observer('老师');

// 被观察者存储观察者的前提，需要先接纳观察者
student.add(parent);
student.add(teacher);
student.setState('被欺负了');