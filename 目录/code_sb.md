```js
checkInputInfo(items) {
  if(items instanceof Array) {
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      if (element.type == 'length') {
        if (this.state[element.key].length < 1) {
          Toast.info(element.desc || '请输入完整信息')
          break
        } 
      } else if (element.type == 'boolean') {
        if (!this.state[element.key]) {
          Toast.info(element.desc || '请输入完整信息')
          break
        } 
      }
      if (index == items.length - 1) {
        return 'checkok'
      }
    }
  } else {
    console.warn('items must be a Array')
    return false
  }
}
```  为什么要写这么一个函数呢？ 

```js
const checkValue = [{
  key: 'inputBankCard',
  type: 'length',
  desc: '请先填写银行卡号'
}, {
  key:'inputBankPhone',
  type: 'length',
  desc: '请输入预留手机号'
}, {
  key:'inputAuthCode',
  type: 'length',
  desc: '请输入验证码'
}, {
  key: 'protocolAgree',
  type: 'boolean',
  desc: '请先勾选同意内容'
}]
const inputStatus = this.checkInputInfo(checkValue)