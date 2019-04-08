## MobX 异步 action
### 异步 action 的原因
    @action 只会对当前运行的函数做出反应，而不会对当前运行函数所调用的函数做出反应。
这意味着，如果action中存在异步的操作：setTimeout、promise .then 或者 async 结构，
并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 @action 中。

#### 关于回调中状态改变
    如果状态未改变是不是就可以不用 @action 包装呢？ 如下代码