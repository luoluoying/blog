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
```
3. runInAction 工具函数
```js
// runInaction 还可以给定第一个参数作为名称， runInAction(f) 实际上是 action(f)() 的语法糖
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
                // 将 最终的  修改放入一个异步动作中
                runInAction(() => {
                    this.githubProjects = filteredProjects
                    this.state = 'done'
                })
            },
            error => {
                // 过程的另一个
                runInAction(() => {
                    this.state = 'error'
                })
            }
        )
    }
}
```

4. async / await 
   @action 仅用于代码块直到第一个await， 在每个await 之后，一个新的异步函数将启动，在每个await
   之后，状态修改代码应该被包装成动作
   ```但是从await拿到结果之后可以直接修改状态，未做动作包装```
```js
configure({ enforceActions: true });

class Store {
    @observable githubProjects = []
    @observable state = 'pending' // 'pending'/ 'done'/ 'error'

    // async / await
    @action
    async fetchProjects() {
        this.githubProjects = []
        this.state = 'pending'

        try {
            const projects = await fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            // await 之后，再次修改状态需要动作

            runInAction(() => {
                this.githubProjects = filteredProjects
                this.state = 'done'
            })

        } catch (error) {
            runInAction(() => {
                this.state = 'error'
            })
        }
    }
}
// await之后修改状态是不是真的需要action包装
@action
async doSomething() {
    console.log('doSomething');
    const result =await get('/getArr')
    console.log(result.data);
    this.arr2=[this.arr2,...result.data]
}
// 测试之后发现，不用action 包装在await 之后也可以修改状态使用
// 实际上是配置项的 是否强制所有的状态修改都在action中
//  mobx-3  使用useStrict(true)
//  mobx-4  使用mobx@4.x：configure({ enforceActions: boolean })
//  mobx-5  使用configure({ enforceActions: value })
```