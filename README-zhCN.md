# Rua-Dva
让dva.js更加好用, 优雅

## 什么是Dva?
[dvajs/dva](https://github.com/dvajs/dva)

## 什么是Rua
rua是重庆话, 普通话里是用力揉和用力捏的意思, 我们这里是处理一下的意思 (Wrapper).

## Actions 来自
[MirrorJs](https://github.com/mirrorjs/mirror)

但是MirrorJs其他部分实在太差了.

## 待办事项
[-] 添加已有的model到rua-dva里面

[-] 集成rua-core

[-] Class化

## 快速开始

### 初始化
```
// 导入
import { ruaDva } from 'rua-dva'
 
// 创建dva
const app = dva({
  extraEnhancers: [],
  onError(e) {
    Toast.fail(e.message, /* duration */1);
  },
})
 
// rua一下
ruaDva(app)
 
// models
app.use(xxx)
...
app.start(xxx)
...
```

### 使用例子1
```
// 原来用法
...
this.props.dispatch({
  type: 'auth/logout',
})
...
 
// 导入
import { actions } from 'rua-dva'
 
// 现在
...
actions.auth.logout()
...
```

### 使用例子2

```
// 原来用法
...
this.props.dispatch({
  type: 'auth/login',
  payload: {
    username: 'admin',
    password: 'rua and roll',
  }
})
...
 
// 导入
import { actions } from 'rua-dva'
 
// 现在
...
actions.auth.login({
  username: 'admin',
  password: 'rua and roll',
})
...
```

### 使用例子3

```
// 原来用法
...
this.props.dispatch({
  type: 'auth/loginAsync',
  payload: {
    username: 'admin',
    password: 'rua and roll',
  },
  success: () => console.log('yeah~'),
  failure: () => console.log('shit~'),
})
...
 
// 导入
import { actions } from 'rua-dva'
 
// 现在
...
actions.auth.loginAsync({
  username: 'admin',
  password: 'rua and roll',
}, {
  success: () => console.log('yeah~'),
  failure: () => console.log('shit~'),
})
...
