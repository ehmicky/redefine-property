import test from 'ava'
import redefineProperty from 'redefine-property'
import { each } from 'test-each'

each(
  [
    [],
    ...[undefined, null, ''].map((input) => [input, 'prop', {}]),
    [{}],
    [{}, null],
    ...[
      undefined,
      null,
      '',
      new Set([]),
      { get: true },
      { set: true },
      { value: undefined, get() {} },
      { value: undefined, set() {} },
      { enumerable: 'true' },
      { writable: 'true' },
      { configurable: 'true' },
      { unknown: true },
    ].map((descriptor) => [{}, 'prop', descriptor]),
  ],
  ({ title }, args) => {
    test(`Validate arguments | ${title}`, (t) => {
      t.throws(redefineProperty.bind(undefined, ...args))
    })
  },
)

each([{}, new Set([]), new Error('test')], ({ title }, input) => {
  test(`Can pass any object input | ${title}`, (t) => {
    t.true(redefineProperty(input, 'prop', { value: true }).prop)
  })
})

each([Symbol('test'), 0, 'prop'], ({ title }, key) => {
  test(`Can pass any key | ${title}`, (t) => {
    t.true(redefineProperty({}, key, { value: true })[key])
  })
})

each(
  ['value', 'get', 'set', 'enumerable', 'writable', 'configurable'],
  ({ title }, propName) => {
    test(`Can pass undefined descriptor values | ${title}`, (t) => {
      t.notThrows(
        redefineProperty.bind(undefined, {}, 'prop', { [propName]: undefined }),
      )
    })
  },
)
