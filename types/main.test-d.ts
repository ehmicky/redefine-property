import redefineProperty, { Options } from 'redefine-property'
import { expectType, expectAssignable } from 'tsd'

expectType<object>(redefineProperty(true))

redefineProperty(true, {})
expectAssignable<Options>({})
