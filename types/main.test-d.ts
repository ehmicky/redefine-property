import redefineProperty from 'redefine-property'
import { expectType, expectError } from 'tsd'

expectType<{}>(redefineProperty({}, 'prop', {}))
expectType<{ a: 1 }>(redefineProperty({ a: 1 as const }, 'prop', {}))

expectError(redefineProperty({}, 'prop', {}, true))

expectError(redefineProperty(true, 'prop', {}))

redefineProperty({}, Symbol(), {})
redefineProperty({}, 0, {})
expectError(redefineProperty({}, true, {}))

expectError(redefineProperty({}, 'prop', true))
redefineProperty({}, 'prop', { enumerable: true })
expectError(redefineProperty({}, 'prop', { enumerable: 'true' }))
redefineProperty({}, 'prop', { writable: true })
expectError(redefineProperty({}, 'prop', { writable: 'true' }))
redefineProperty({}, 'prop', { configurable: true })
expectError(redefineProperty({}, 'prop', { configurable: 'true' }))
redefineProperty({}, 'prop', { value: true })
redefineProperty({}, 'prop', { value: undefined })
redefineProperty({}, 'prop', { get() {} })
expectError(redefineProperty({}, 'prop', { get: true }))
expectError(redefineProperty({}, 'prop', { get(value: true) {} }))
redefineProperty({}, 'prop', { set(value: unknown) {} })
redefineProperty({}, 'prop', { set() {} })
redefineProperty({}, 'prop', { set: (value: unknown) => true })
expectError(redefineProperty({}, 'prop', { set: true }))
