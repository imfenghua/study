vue3创建&更新过程
1. 每个vue应用都是通过createApp({}).mount('#app), 当调用mount方法的时候，就会触发render(vnode, container)。然后根据vnode是否存在判断执行patch操作还是unmount操作。patch操作就是将vnode转换成真实dom，然后插入到container中。unmount操作就是将container中的dom删除。
2. patch时，先比较新旧节点的type是否一致，若不一致就直接删除旧节点。然后针对不同类型的vnode做不同的处理。
 - 如果是文本节点，就直接替换文本内容。
 - 如果是元素节点，先比较新旧节点的属性，调用el[key]或者setAttribute更新属性；然后再比较新旧子节点并更新（子节点有三种类型：1.没有子节点 2. 有文本节点 3. 有多个子节点）。当均有多个子节点时，执行diff算法（vue3是快速diff）
 - 如果是组件节点，会触发setupcomponent方法，初始化props、slots，创建渲染上下文（目的是为了确保this上的属性的读取顺序）。若存在setup方法，会触发获取返回值。如果返回值是函数，即为render函数，获取vnode。如果返回值是对象，就将对象作为vnode的props。然后统一执行finishComponentSetup方法。如果instance上不存在render方法。会先进行模板的编译。使用有限状态自动机将字符串逐个消费，parse解析成模板ast，然后转换成JavaScript ast。最后generator返回字符串形式的code,生成render函数。调用render生成vnode,并触发patch
 然后触发beforecreated, 初始化method, data(变成响应式)，computed等。触发created
 其中：render函数放在effect副作用中（render.call(rendertext, renderText)），当数据发生变更时，会将更新副作用放到一个微任务队列，批量执行。
3. 在将模板编译的时候，会进行静态标记区分静态节点和动态节点。对于静态节点会进行变量提升，预字符串等操作，会事件也会进行缓存。来提高性能。

vue3优化
1. 使用proxy代替defineProperty, 监听对象的变化，不要要递归遍历，可以监听到对象属性的添加和删除，也可以监听数组的变化
2. 使用typescript进行类型检查
3. tree-shaking, 优化打包体积
4. 重写虚拟dom和diff算法，使用静态标记和变量提升，预字符串等操作，来提高性能
5. 使用composition api，将逻辑分离，更加清晰

new Vue做了什么
1. 将options和构造函数上的属性进行合并，合并成一个新的options， 并挂载到vue实例上
2. 将data属性也挂载到vue实例上
3. 初始化生命周期、method、data等，调用object.defineProperty改写data属性的gettter和setter使其变成响应式数据
4. 对于template进行模板编译，模板字符串编译成ast，然后将ast转换为render函数，最后调用render函数生成vnode。在调用render的过程中会触发属性的getter，将属性的依赖收集起来。当属性发生变化时，会触发属性的setter，执行依赖的更新函数，diff有进行局部更新。

双向绑定的原理
1. 双向绑定就是当数据发生变更时，视图能更新。当视图发生变更时， 数据也能随之改变。
2. vue里是通过使用object.defineProperty改写getter和setter方法来实现响应式数据。双向绑定就是基于响应式数据来实现的。对于一个input绑定了value，当渲染的时候，会触发某个属性的getter， 进行依赖收集。然后监听change事件，当input的值发生变化时，会触发change事件，然后触发setter方法，在setter里会执行依赖的更新函数，更新视图。
3. v-modal监听的是input事件

vue组件通信
1. 父子通信： props
2. 子父通信: emit、ref
3. 兄弟通信: 可以先由子组件传给父组件，然后再由父组件传给子组件
4. 跨级通信： provide/inject、$attrs、$listeners或者可以使用vuex


React为什么要引入hooks
 1. class组件中，可能有很多逻辑相似的代码分布在不同的生命周期内， 造成代码的冗余，不利于维护
 2. class组件中，对于this指向的问题，学习成本高，容易出错
 3. 对于与状态相关的逻辑相似的代码，难以抽离和复用,使用hooks，可以将逻辑抽离出来，复用，而且每次生成的都是独立的状态
 4. 我们可以通过自定义hook, 封装自己想要的功能，比如数据请求，数据缓存等

对React fiber的理解
1. 作为静态的数据结构来说，每个fiber对应一个react element，它保存了该组件的类型以及对应的dom节点等信息
2. 作为架构来说的话， react15采用的是stack reconciler，而react16开始使用的是fiber reconciler, 能实现异步可中断。fiber可以通过自身的return、child、sibling属性来与其他fiber构成一颗fiber树
3. fiber是react中的最小工作单元。它保存了本次更新中组件改变的状态以及要执行的工作

React怎么实现快速响应的？
1. 在React15的时候， 如果发生更新，它采用的是栈递归的调度策略， 也就是说它需要深度优先遍历完所有的vdom,然后通过diff找出所有更新的节点后才会释放主线程，交给浏览器去渲染。整过过程是同步的而且不可被中断，当节点很复杂的时候，执行时间可能超过一帧的时间，用户就会有卡顿的感觉。
2. 为了解决这个问题， 在React16中重构了协调器，将其变成异步可中断的更新。同时加入了调度器， 通过时间切片，将一个长任务拆分到每一帧不同的task中。然后由调度器根据任务的优先级以及时间切片是否还有剩余时间来进行任务的调度。
3. 当调度器将任务交给协调器后， 协调器会为虚拟dom打上增删改的标记。整个过程都是在内存中进行，所以即使中断了，用户也不会有感知。等所有组件都完成reconcilier以后，才会交给渲染器去将dom渲染到页面上。
4. 日常开发中的话，我们可以使用react.memo\purecomponent\usecallback\usememo\key等显式的告诉react哪些组件不需要重复计算


react渲染过程
1. 主要分为render和commit两个阶段
2. 调度器会根据任务的优先级判断是执行performanceSyncworkOnRoot还是performanceConcurrentWorkOnRoot,这两者的主要区别就是是否需要根据shouldyield判断浏览器的空闲事件， 然后进入performunitofwork进入render阶段的beginwork阶段， 在这里会根据current是否存在判断是mount还是update阶段。如果是update阶段会根据fiber的props以及type是否一致判断是否复用。如果不能复用。就会调用reconcilechildfiber将新旧fiber进行diff，同时为每个需要更新的fiber打上effectTag, 然后进入completework。如果是mount，会调用mountchildfiber, 创建新的fiber，并且只为根节点添加effectTag, 然后进入completework。
3. 进入completework后，会根据current以及statenode判断是mount还是update。如果是mount阶段，会为当前fiber创建一个dom，并将子节点都append到这个dom节点上， 然后对这个dom的props做更新。如果是update阶段，会对当前节点的props做更新，并将更新挂载在fiber的updatequeue上（这里针对的是hostComponent）,在每次completework时， 会将有更新的fiber拼接到父fiber的effectlist上，然后进入commit阶段。
4. commit过程分为三个阶段，会先将useeffect的回调以及同步任务都执行完以后，进入beforemutation，mutation，layout。在beforemutation阶段，会对所有的effectlist进行遍历，处理节点比如focus，blur等事件，然后回调用getSnapshotBeforeUpdate， 并将useeffect的回调以正常优先级注册。然后进入mutation阶段， 在该阶段会执行dom, 遍历effectlist,重置文本节点， 更新ref,并根据effectTag执行对应的dom操作，比如创建、更新（上一次uselayout的销毁函数、遍历update queue更新props）、删除dom节点（componentwillunmount在此执行）。此时能拿到更新后的dom,但还没有渲染到页面上。将root的current指向workInProgressRoot, 然后进入layout阶段，遍历effectlist,执行componentdidmount，componentdidupdate，useLayoutEffect的回调，更新ref。同时会将useeffect的销毁和回调添加到队列， 在layout执行完以后异步调用，先全部销毁再执行全部回调。当commit结束后，会重新触发ensureRootIsScheduled，然后进入下一次的render阶段。


react diff
1. 三个前提：只比较相同层级的节点； 不同类型的节点结构不一样； 可以用key来标识节点
2. 对于单个节点， diff的时候比较key是否一致， 如果不一致，将该fiber打上delete的tag.如果一致， 再比较type是否一致， 如果type一致， 就直接复用， 否则给当前fiber以及兄弟fiber都打上delete的tag
3. 对于多个节点， 会进行两次遍历。第一次遍历依次比较新旧节点的key是否一致， 当key不一致或者遍历完以后直接跳出遍历。然后进行第二次遍历，若新的遍历完，旧的还有，则给剩下的旧节点打上delete，若新的还剩， 则新的都打上placement。若新旧都有剩， 则先遍历旧节点，创建key,oldnode的map，然后遍历新节点，如果新节点的key在map中，则比较oldindex与lastplaceIndex判断是否需要移动，否则打上placement。


react hook如何更新
1. 触发react更新一般时调用reactdom.render、setState等方法
2. 更新主要分mount和update两部分。当首次mount的时候，执行到useState的时候，都会创建一个hook对象，形成一个单向链表，保存在fiber对象上。其中hook.queue保存中当前fiber的更新任务， 初始化时为空。当执行setstate的时候，就会创建一个update对象，保存在刚刚创建的那个对应的hook.queue.pending上，形成一个单向环状链表。然后调用markUpdateLaneFromFiberToRoot从当前fiber向上回溯到rootfiber,更新遇到的父节点的childlane。接着调用ensureRootIsScheduled让调度器根据优先级去执行fiber的更新，进入render阶段，再次遇到useState, 会从hook对象上找到update链表，从头开始执行获取到最新的state，将新旧节点进行diff以后生成带有effectTag的新节点，并将其挂载到父fiber的effectList链表的末尾，在commit阶段会遍历这个链表，最终完成视图的更新。

react调度原理
1. 当setState 的时候会调用markUpdateLaneFromFiberToRoot，从当前fiber向上回溯到rootfiber,更新遇到的父节点的childlane。接着调用ensureRootIsScheduled让调度器根据优先级调用scheduleCallback去执行fiber的更新
2. 然后会创建一个新task添加进全局task queuer队列， 并根据优先级设置过期时间，按过期时间排序。如果此时没有正在进行中的工作，就会请求requestHostCallback(flushWork)调度， 通过message channel的port进行postmeassage。当监听到message事件时，会触发performanceWorkUntilDeadline方法, 在这个方法里执行flushwork回调函数。回调函数会返回布尔值告诉是否还有剩余任务。若执行完还有剩余任务，就会继续post message。如此循环，直到没有任务为止。
3. 其中在执行调度的回调函数时，会从头开始循环执行task queue中的每一个任务。在执行每个任务之前，都会检查该任务是否超时以及时间切片是否还有剩余， 如果超时就会等待下一次调度。否则就会取出第一个任务执行，执行结束并且没有派生的回调，会将其从task queue中删除。


react生命周期
1. react生命周期一般来说存在于class组件中，但是现在hooks组件中useeffect也可以等价于某些生命周期
2. constructor、getDerivedStateFromProps、render、componentDidMount、shouldComponentUpdate、getSnapshotBeforeUpdate、componentDidUpdate、componentWillUnmount
3. useEffect可以等价于componentDidMount、componentDidUpdate、componentWillUnmount

react中context的实现原理
1. 在createContext返回的对象中包含provider和consumer，是一个reactelement对象，消费时直接从该对象中读取即可， 并且在consumer的fiber节点的dependency上拼接上当前context
2. 当context发生更新时， 会从当前节点开始往下查找子节点中dependency上有当前context的fiber节点， 然后从当前节点开始向上回溯到rootfiber， 在回溯的过程中收集经过的父节点的lane更新优先级，最后通过调度算法执行相应的更新，重新进入render&commit阶段，完成视图的更新


react双缓存机制
1. 在react中最多会同时存在两棵fiber树。一棵是当前屏幕上显示内容对应的fiber树叫current fiber， 还有一棵是内存中正在构建的fiber树叫做workInProgress Fiber树。这两棵树之间通过alternate属性连接，用于判断是否能够复用
2. 当进入commit阶段的时候，react应用的根节点就会通过current指针会从current Fiber切换到workinprogress fiber树。此处原来的workinprogress fiber树就会变成current fiber等待下一轮更新

mixin、hoc、render props、hooks的区别
1. 本质上都是为了实现代码复用
2. mixin最终会合并成一个对象，有可能会产生命名冲突， 同一个状态可能会有很多不同的逻辑，相互之间存在隐式依赖，耦合严重，不利于维护
3. hoc是一个函数，接收一个组件作为参数，返回一个新的组件，可以通过props传递数据，但是会产生嵌套地狱，不利于维护。而且对于子组件来说，不知道自己是被哪个hoc包裹的，不利于调试。但是相对于mixin来说，hoc的耦合度更低，不会产生命名冲突, 而且时树状结构，降低复杂度
4. render props是将组件作为render的参数，能清晰的看清数据流动，能自定义组件的渲染逻辑，开放性更明显。但是写法上相对于hoc来说更复杂，hoc可以借助装饰器模式一行代码就能解决。
5. hooks能将ui与状态分离， 每次使用都会产生一个独立的状态，不同hook可以进行组合产生新的hooks, 方便维护，而且也没有class组件的this指向问题。但是hooks的使用需要遵循一定的规则，不能放在条件语句中，否则会产生不可预料的错误。

redux三大原则
1. 单一数据源
2. state是只读的，只能通过触发action来改变state
3. 使用纯函数来执行修改

redux中间件
1. 中间件本质上是一个函数，在action触发后，到达reducer之前执行，可以在这个过程中进行一些操作，比如日志打印、异步请求、异常处理等
2. 使用applyMiddleware来注册中间件，applyMiddleware会返回一个函数，这个函数接收createStore作为参数，返回一个新的createStore
3. 每个中间件的格式是({getState, dispatch}) => next => action => { reutrn next(action) }

mobx和redux的区别
1. redux是单一数据源，mobx可以根据UI、数据等划分不同的store
2. redux中的state是只读的，每次reducers都会返回一个新的state，mobx中的state是可变的，可以直接修改
3. redux中需要subscribe来监听state的变化，mobx中可以通过observer来监听state的变化

webpack构建流程
1. 初始化：
 - 合并配置文件以及shell脚本获取最终的配置参数
 - 初始化complier对象
 - 初始化内置插件，配置插件的环境
 - 调用complier.run方法生成complication开始编译, 分析入口文件，调用complier.addEntry方法将入口文件转化成dependency对象，dependency对象包含了文件的路径，文件的内容，文件的依赖等信息。
2. 编译：（module => ast => dependences => module）
 - 调用make方法，使用dependency对应的工厂函数创建module对象。
 - 调用loader将模块转换成对应的js代码,再使用acorn解析js代码，生成ast。分析ast, 当遇到require时，将依赖的模块转化成depengency对象，添加到module对象中，递归调用make方法，直到所有依赖都转化成module对象。生成一颗依赖树。

 3. 输出：
  - 根据入口和配置文件，生成包含一个或多个模块的chunk,然后将chunk转化成文件，输出到文件系统中。（入口及入口依赖的模块组成一个chunk, 动态引入的单独成一个chunk）
  - 根据配置，确定输出的路径和文件名

webpack如何做性能优化
1. 减小代码体积
  - 生产模式下默认开启tree shaking， 基于es module编译时静态分析，确定依赖的模块，去除无用代码
  - 开启gzip,使用compression-webpack-plugin配置filename、algorithm、test、threshold、minRatio、deleteOriginalAssets等参数
  - 代码压缩， 使用ugilfyJsPlugin压缩代码
  - mini-css-extra-plugin压缩css, 代码抽离
  - 配置splitChunk, 代码复用（chunk：all）
  - 合理开启source map
2. 优化打包速度
 - babel:开启cacheDictionary 配置exclude
 - happyPack多进程打包
 - 配置alias、external
 - DllPlugin, 将第三方库单独打包， 提前缓存并打包，不用每次都打包

webpack proxy
1. 基于webpack-dev-server, 将请求发送到代理服务器上， 再由代理服务器转发到服务器。避免跨域问题。因为浏览器和代理服务器时同源的。 服务器与服务器之间不存在跨域
2. 配置参数：target、pathrewrite、security、changeorigin

webpack与rollup、vite对比
1. webpack生态完善，插件功能齐全。支持HRM，支持按需加载，公共模块提取。
2. roll up是基于es module打包的。打包后代码依然具有可读性，会删除无用代码，打包效率较高。但是加载非ESM的模块比较复杂，需要使用插件进行转换。由于最终模块都被打包到全局，不能HRM， 代码的拆分和复用比较困难。必须使用require.js这样的AMD库。
3. 对于应用程序，对开发条件要求比较高的，可以使用webpack.对于一些JavaScript库，可以使用rollup
4. vite基于rollup实现热更新。体积小，速度快。由于现代浏览器本身支持es module, vite在启动的时候不会编译， 而是当浏览器请求某个模块时，再对该模块进行编译。热更新也是如此，只会重新请求某个模块。不像webpack需要先分析依赖然后全部打包后再更新。所以vite启动速度比较快，开发体验好。

webpack 热更新原理
1. 配置方法
 - devServer设置hot: true
 - 使用HTMLModuleReplacePlugin或者在script脚本添加--hot
2. 原理
 - 启动webpack devServer的时候，webpack-dev-middleware会调用webpack的watch方法，监听文件的变化。同时会在服务端和浏览器之间建立一个websocket链接。将webpack编译和打包的状态发送到浏览器。
 - 当文件发生变化时，webpack会重新编译打包， 并将打包的文件以js对象的格式保存在内存中（因为在内存中读取比在文件系统中更方便， 还减少了文件的读写操作）。
 - 监听webpack的done事件， 当打包结束后通过websocket将更新后的hash值发送给浏览器， 如果浏览器接收到的消息的type为hash, 就会将最新的hash值暂存下来；如果type是ok, 就会触发reload事件，根据配置的hot参数，决定是刷新页面还是热更新。如果是热更新的话，会抛出webpackHotUpdate事件
 - dev-server监听到webpackHotUpdate事件，会触发HMRruntime的check方法， 在这个方法内部，会以上一次的hash值发起ajax请求获取最新hash值，以及更新的模块。然后再次发起jsonp请求获取模块的最新代码，并返回给HMR runtime中。（ajax和jsonp请求的文件名都是上一次的hash值）
 - HMR runtime调用hotApply方法， 找到过期的模块和依赖，然后从缓存中删除过期的模块和依赖，添加新的模块。触发局部更新。若热更新发生错误时，会采取降级方法，刷新页面。对于模块间的依赖关系，会遍历该模块的children， 然后查找children的parents，将该模块从parents中删除。

webpack 如何分包
1. 基于esmodule的动态导入的方式，webpack会自动分包和按需加载， 可以设置webbpackChunkName来设置分包的名字
2. 配置optimization.splitChunks来手动设置分包， 会将公共模块分离出来， 也可以设置cacheGroups来设置分包的规则
3. 配置多个入口文件，就会有多少个chunk

webpack 动态import的原理
1. webpack会将动态导入的模块单独打包成一个chunk， 通过jsonp的方式加载
2. 具体的来说就是它会为这个模块构建一个promise，将这个promise的resolve，reject都保存到一个数组中，并将这个promise添加到promises的队列中。
3. 然后为这个模块创建一个jsonp添加到head中。 当加载完成后会执行jsonp的回调，将moduleid和module内容都存放到modules上。
4. 当所有的模块都加载完成后，会遍历promises数组，将每个promise的resolve方法执行，将module内容传入。
5. 最后调用webpack内置的require方法，如果缓存中有，则从缓存中读取，否则将module内容传入，返回module.exports


webpack5新特性
1. 缓存： 1.尝试用持久性缓存来提高构建性能。2.尝试用更好的算法和默认值来改进长期缓存
2. 模块联邦： 1.允许一个应用程序使用来自另一个应用程序的模块，而无需进行构建。2.允许将应用程序的一部分作为库发布，以便其他应用程序可以使用它们。
3. 优化： 1.更好的树摇。2.更好的代码生成。3.更好的持久化缓存。
4. 开发： 1.更好的调试体验。2.更好的错误消息。3.更好的模块热替换。


babel的原理：
1. 总的来说就是通过词法分析和语法分析将js代码转换成AST，然后对抽象语法树进行遍历，对每个节点进行转换，最后将抽象语法树转换成js代码。
2. 解析阶段：调用babel/parse进行词法分析（对输入的字符做标记处理）和语法分析（处理标记与标记之间的关系）， 生成AST
3. 转换阶段：调用babel/traverse对AST进行深度优先遍历，调用插件，按需对节点进行增删改的操作
4. 生成阶段：调用babel/gengerate将AST转换成js代码字符串

