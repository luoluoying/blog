## MobX 异步 action
### 异步 action 的原因
    @action 只会对当前运行的函数做出反应，而不会对当前运行函数所调用的函数做出反应。
这意味着，如果action中存在异步的操作：setTimeout、promise .then 或者 async 结构，
并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 @action 中。

#### 关于回调中状态改变
    如果状态未改变是不是就可以不用 @action 包装呢？ 如下代码

``` js
@observable testValue = 'testValue'

@action
_doSomething() {
    console.log('_dosomething')
    console.log(this.testValue)  // testValue
    
    setTimeout(function(){
        console.log('打印当前setTimeout中的this')
        console.log(this) // Window
    }, 1000)
}
```
如果回调中不需要对Mobx的对象属性做操作，那么可以不使用 @action 来包装，如果需要获取到则需要
```js
@action
_doSomething() {
    console.log('_dosomething')
    console.log(this.testValue, '0') // testValue

    setTimeout(action('console_testValue', () => {
        console.log(this.testValue, '1') // testValue
        this.testValue = 'testValue2'
    }), 1000)
}
auto = autorun(() => {
    console.log(this.testValue, 'autorun')  // testValue2
});
```

#### @action未包装的情况下

```js
configure({ enforceActions: true });

class Store {
    @observable githubProjects = []
    @observable state = 'pending' // 'pending'/ 'done'/ 'error'

    @action
    fetchProjects() {
        this.githubProjects = []
        this.state = 'pendding'

        fetchGithubProjectsSomehow().then(
            projects => {
                const filteredProjects = somePreprocessing(projects)
                this.githubProjects = filteredProjects
                this.state = 'done'
            },
            error => {
                this.state = 'error'
            }
        )
    }
}
```
上面会抛出异常，因为 fetchGithubProjectsSomehow promise 的回调函数不是 fetchProjects 
动作的一部分，因为动作只会应用于当前栈。

#### 修改的几种方式
1. 将回调函数变成动作 (简单修复) 
```js
// action.bound 用于绑定this
class Store {
    @observable githubProjects = []
    @observable state = 'pending' // 'pending'/ 'done'/ 'error'

    @action
    fetchProjects() {
        this.githubProjects = []
        this.state = 'pendding'

        fetchGithubProjectsSomehow().then(this.fetchProjectsSuccess, this.fetchProjectsError)
    }

    @action.bound
    fetchProjectsSuccess(projects) {
        const filteredProjects = somePreprocessing(projects)
        this.githubProjects = filteredProjects
        this.state = 'done'
    }

    @action.bound
    fetchProjectsError(error) {
        this.state = 'error'
    }
}
```
这种整洁清楚，但是异步流程复杂之后会很冗余

2. 使用 action 关键字包装
```js
// action 关键字需要给action操作命名  action('actionName', ...)
class Store {
    @observable githubProjects = []
    @observable state = 'pending' // 'pending'/ 'done'/ 'error'

    @action
    fetchProjects() {
        this.githubProjects = []
        this.state = 'pendding'

        fetchGithubProjectsSomehow().then(
            // inline create action
            action('fetchSuccess', projects => {
                const filteredProjects = somePreprocessing(projects)
                this.githubProjects = filteredProjects
                this.state = 'done'
            }),
            action('fetchError', error => {
                this.state = 'error'
            })
        )
    }
}
