const model = {
  namespace: 'test',
  reducers: {
    testReducer(state: any)
    {
      return { ...state }
    },
  },
  effects: {
    * testEffect()
    {
      yield 1
    },
  }
}

describe('RuaDva Tests', () => {
  test('1', () => {

  })
})
