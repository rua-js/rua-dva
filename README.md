# Rua-Dva
Easier way to use dva.js

[中文介绍](./README-zhCN.md)

## Stable Version: 0.2.6
`yarn add rua-dva@0.2.6`

## What is Dva?
[dvajs/dva](https://github.com/dvajs/dva)

## What is Rua
rua means wrapper / enhancement

## Inspiration
[MirrorJs](https://github.com/mirrorjs/mirror)

the actions design is great, but other part of mirror.js is bad.

## Todo
- [ ] enable adding existing model to rua-dva

- [ ] integrated with rua-core

- [ ] use Class rewrite rua-dva

## Bootstrap

### Initiation
```
// import
import { ruaDva } from 'rua-dva'
 
// create dva
const app = dva({
  extraEnhancers: [],
  onError(e) {
    console.log(e.message);
  },
})
 
// rua
ruaDva(app)
 
// models
app.use(xxx)
...
app.start(xxx)
...
```

### Usage 1
```
// before
...
this.props.dispatch({
  type: 'auth/logout',
})
...
 
// import
import { actions } from 'rua-dva'
 
// now
...
actions.auth.logout()
...
```

### Usage 2

```
// before
...
this.props.dispatch({
  type: 'auth/login',
  payload: {
    username: 'admin',
    password: 'rua and roll',
  }
})
...
 
// import
import { actions } from 'rua-dva'
 
// now
...
actions.auth.login({
  username: 'admin',
  password: 'rua and roll',
})
...
```

### Usage 3

```
// before
...
this.props.dispatch({
  type: 'auth/loginAsync',
  payload: {
    username: 'admin',
    password: 'rua and roll',
  },
  success: () => console.log('yeah~'),
  failure: () => console.log('no~'),
})
...
 
// import
import { actions } from 'rua-dva'
 
// now
...
actions.auth.loginAsync({
  username: 'admin',
  password: 'rua and roll',
}, {
  success: () => console.log('yeah~'),
  failure: () => console.log('no~'),
})
...
