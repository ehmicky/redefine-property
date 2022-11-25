import test from 'ava'
import redefineProperty from 'redefine-property'

test('Dummy test', (t) => {
  t.true(redefineProperty(true))
})
