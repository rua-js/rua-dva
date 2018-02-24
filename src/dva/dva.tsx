import * as React from 'react'
// @ts-ignore: no typescript for dva
import _dva from 'dva/src'

const dva = (ruaDva: Function) => (options: any) => {
  // create dva
  const app = _dva(options)

  // rua dva
  ruaDva(app)

  return app
}

export default dva
