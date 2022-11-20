/* eslint-disable max-lines */
import test from 'ava'
import redefineProperty from 'redefine-property'
import { each } from 'test-each'

const noop = function () {}
const otherNoop = function () {}

each(
  [
    ...[true, false, undefined].map((newConfigurable) => [
      { configurable: false },
      { configurable: newConfigurable },
      { configurable: false },
    ]),
    ...[true, false].flatMap((oldEnumerable) =>
      [true, false, undefined].map((newEnumerable) => [
        { configurable: false, enumerable: oldEnumerable },
        { enumerable: newEnumerable },
        { enumerable: oldEnumerable },
      ]),
    ),
    ...[true, false].flatMap((oldWritable) =>
      [true, false, undefined].map((newWritable) => [
        { configurable: false, writable: oldWritable },
        { writable: newWritable },
        { writable: oldWritable && newWritable !== false },
      ]),
    ),
    [
      { configurable: false, writable: true, value: false },
      { value: true },
      { value: true },
    ],
    [
      { configurable: false, writable: false, value: false },
      { value: true },
      { value: false },
    ],
    ...[true, false].map((oldWritable) => [
      { configurable: false, writable: oldWritable, value: false },
      {},
      { value: false },
    ]),
    ...['get', 'set'].flatMap((propName) => [
      [
        { configurable: false, [propName]: noop },
        { value: true },
        { [propName]: noop },
      ],
      [
        { configurable: false, [propName]: noop },
        { [propName]: otherNoop },
        { [propName]: noop },
      ],
      [
        { configurable: false, value: false },
        { [propName]: noop },
        { value: false },
      ],
    ]),
    ...['enumerable', 'writable', 'configurable'].flatMap((propName) =>
      [true, false].flatMap((oldValue) => [
        [
          { [propName]: oldValue },
          { [propName]: undefined },
          { [propName]: oldValue },
        ],
        // eslint-disable-next-line max-nested-callbacks
        ...[true, false].map((newValue) => [
          { [propName]: oldValue, configurable: true },
          { [propName]: newValue },
          { [propName]: newValue },
        ]),
      ]),
    ),
    ...[
      { value: false },
      { value: undefined },
      { get: noop },
      { set: noop },
    ].flatMap((currentDescriptor) => [
      ...[
        { value: true },
        { value: undefined },
        { get: otherNoop },
        { set: otherNoop },
      ].map((newDescriptor) => [
        { configurable: true, ...currentDescriptor },
        newDescriptor,
        newDescriptor,
      ]),
      [{ configurable: true, ...currentDescriptor }, {}, currentDescriptor],
    ]),
    ...[
      ['get', 'set'],
      ['set', 'get'],
    ].map(([propNameA, propNameB]) => [
      { configurable: true, [propNameA]: noop },
      { [propNameB]: otherNoop },
      { [propNameA]: noop, [propNameB]: otherNoop },
    ]),
  ],
  ({ title }, [currentDescriptor, newDescriptor, expectedDescriptor]) => {
    test(`Can set descriptors | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutating-methods
      const input = Object.defineProperty({}, 'prop', currentDescriptor)
      const inputA = redefineProperty(input, 'prop', newDescriptor)
      const descriptor = Object.getOwnPropertyDescriptor(inputA, 'prop')
      t.like(descriptor, expectedDescriptor)
    })
  },
)

test('Default descriptors', (t) => {
  const input = redefineProperty({}, 'prop', {})
  const descriptor = Object.getOwnPropertyDescriptor(input, 'prop')
  t.deepEqual(descriptor, {
    value: undefined,
    enumerable: true,
    configurable: true,
    writable: true,
  })
})

test('Partial default descriptors', (t) => {
  const input = redefineProperty({}, 'prop', { enumerable: false })
  const descriptor = Object.getOwnPropertyDescriptor(input, 'prop')
  t.false(descriptor.enumerable)
  t.true(descriptor.configurable)
})
/* eslint-enable max-lines */
