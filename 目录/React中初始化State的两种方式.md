## 初始化State的两种方式
1. 在Constructor内初始化
2. 直接在class内初始化

#### 在构造函数中初始化
```js
import { React, Component } from 'react'

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            currentState: 'not-panic'
        }
    }

    render() {
        //
    }
}

// 一种反模式： 从props的值来初始化state? 是真的反？
// don't do this
class BadExample extends Component {
    state = {
        data: props.data
    }

    componentDidUpdate(oldProps) {
        if(oldProps.data !== this.props.data) {
            this.setState({
                data: this.props.data
            })
        }
    }
    render() {
        return (
            <div>
                The Data: {this.state.data}
            </div>
        )
    }
}

// 上面是一个错误的模式，可以直接使用props来获取，而不要在state中对props的内容做初始化，
//props或者state改变都会触发re-render 
// 可以使用这种方式
class GoodExample extends Component {
    render() {
        return (
            <div>
                The Data: {this.props.data}
            </div>
        )
    }
}

/**
 * 那么是基于props来初始化state可不可以呢？
 * 原始版本的react 文档提到： 如果prop只是组件内部控制的种子state, 那么就不是反模式
 * 如下：
 * However, it’s not an anti-pattern if you make it clear that the prop is only 
 * seed data for the component’s internally-controlled state.
 */
// 如果组件的state需要一个开始值，然后控制它。这个组件拥有这个数据吗？
// 一个例子，输入框的默认填充, defaultValue 属性
<label>
    Name: 
    <input 
    type="text"
    defaultValue="nobody"
    ref={c => this.nameInput = c}
    />
</label>

```
#### 直接在class中初始化
```js
// 直接初始化
class App extends React.Component {
    state = {
        loggedIn: false,
        currentState: 'not-panic',
        someDefaultThing: this.props.whatever
    }

    render() {
        // ...
    }
}

// 需要注意的是
/**
 * 没有constructor
 * state属性直接引用，不是this.state，而是state
 * 作用域在class内，而不是在一个方法
 * 继续可以访问到this.props 以及 this.context
 * 这是一个类实例属性而不是静态属性，可以使用propTypes
 */

 // Note: As I’m writing this, 
 // the class property syntax is a Stage 3 proposal 
 // so it’s not part of the official JS spec yet. 
 // To use it, you’ll need to enable Babel’s class properties transform.

 // 使用需要安装一下babel class properties transform
 ```
#### 两者对比哪个更好
好与坏取决于自己的想法，但是通过一下对比，直接初始化，
以及使用箭头函数来避免在构造函数中绑定this很方便的简洁了代码
 ```js
 class Thing extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        // do stuf
    }
 }

 class Thing extends React.Component {
    // this is all you need to do:
    handleClick = (event) => {
        // do stuff
    }
 }
 ```