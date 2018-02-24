import * as React from 'react'
// @ts-ignore
import { create } from 'dva-core'
import { Provider } from 'react-redux'
// @ts-ignore
import * as global from 'global'

const dvaLite = (ruaDva: Function) => (options: any) => {
  // create dva
  const app = create(options)
  // rua dva
  ruaDva(app)
  // avoid duplicate registration
  if (!global.registered) options.models.forEach((model: any) => app.model(model))
  global.registered = true
  // old start
  app.start()
  // store
  const store = app._store

  // new start
  app.start = (container: any) => () => (
    <Provider store={store}>
      {container}
    </Provider>
  )

  app.getStore = () => store

  return app
}

export default dvaLite
