import { expectType } from 'tsd'

import redefineProperty from 'redefine-property'

expectType<{}>(redefineProperty({}, 'prop', {}))
expectType<{ a: 1 }>(redefineProperty({ a: 1 as const }, 'prop', {}))

// @ts-expect-error
redefineProperty({}, 'prop', {}, true)

// @ts-expect-error
redefineProperty(true, 'prop', {})

redefineProperty({}, Symbol('test'), {})
redefineProperty({}, 0, {})
// @ts-expect-error
redefineProperty({}, true, {})

// @ts-expect-error
redefineProperty({}, 'prop', true)
redefineProperty({}, 'prop', { enumerable: true })
// @ts-expect-error
redefineProperty({}, 'prop', { enumerable: 'true' })
redefineProperty({}, 'prop', { writable: true })
// @ts-expect-error
redefineProperty({}, 'prop', { writable: 'true' })
redefineProperty({}, 'prop', { configurable: true })
// @ts-expect-error
redefineProperty({}, 'prop', { configurable: 'true' })
redefineProperty({}, 'prop', { value: true })
redefineProperty({}, 'prop', { value: undefined })
redefineProperty({}, 'prop', { get() {} })
// @ts-expect-error
redefineProperty({}, 'prop', { get: true })
// @ts-expect-error
redefineProperty({}, 'prop', { get(value: true) {} })
redefineProperty({}, 'prop', { set(value: unknown) {} })
redefineProperty({}, 'prop', { set() {} })
redefineProperty({}, 'prop', { set: (value: unknown) => true })
// @ts-expect-error
redefineProperty({}, 'prop', { set: true })
