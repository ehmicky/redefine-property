import test from 'ava'

import redefineProperty from 'redefine-property'

test('Handle errors when setting', (t) => {
  // eslint-disable-next-line fp/no-proxy
  const input = new Proxy(
    {},
    {
      defineProperty: () => {
        throw new Error('unsafe')
      },
    },
  )
  t.notThrows(redefineProperty.bind(undefined, input, 'prop', {}))
})
