# Rua-Dva
让dva.js更加好用, 优雅 (灵感来自 by [MirrorJs](https://github.com/mirrorjs/mirror))

## 稳定版本: 0.4.1
`yarn add rua-dva@0.4.1`

## 什么是Dva?
[dvajs/dva](https://github.com/dvajs/dva)

## 功能
- `actions` 简化了 `dispatch` 函数 (See usage 1,2,3)
- `dvaLite` 是一个简化版去掉了原始dva集成的React Router
- [开发中] `dvaReactNavigation` 集成了 `React Navigation` 路由库

## Todo
- [ ] dvaReactNavigation

## 快速开始

### 初始化
```
// 导入
import { ruaDva } from 'rua-dva'
 
// 创建dva
const app = dva({
  extraEnhancers: [],
  onError(e) {
    console.log(e.message);
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
