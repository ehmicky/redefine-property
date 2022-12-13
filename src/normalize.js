import isPlainObj from 'is-plain-obj'

// Normalize and validate arguments
export const normalizeInput = (input, key, newDescriptor) => {
  if (!isAnyObj(input)) {
    throw new TypeError(`Argument must be an object: ${input}`)
  }

  if (!isValidKey(key)) {
    throw new TypeError(
      `Property key must be a string, a symbol or an integer: ${key}`,
    )
  }

  return normalizeDescriptor(newDescriptor)
}

const isAnyObj = (value) => typeof value === 'object' && value !== null

const isValidKey = (key) => {
  const type = typeof key
  return type === 'string' || type === 'symbol' || type === 'number'
}

const normalizeDescriptor = (newDescriptor) => {
  if (!isPlainObj(newDescriptor)) {
    throw new TypeError(`Descriptor must be a plain object: ${newDescriptor}`)
  }

  const {
    enumerable,
    writable,
    configurable,
    value,
    get,
    set,
    ...unknownProps
  } = newDescriptor
  const hasValue = 'value' in newDescriptor
  validateDescriptor({
    enumerable,
    writable,
    configurable,
    get,
    set,
    unknownProps,
    hasValue,
  })
  return { enumerable, writable, configurable, value, get, set, hasValue }
}

const validateDescriptor = ({
  enumerable,
  writable,
  configurable,
  get,
  set,
  unknownProps,
  hasValue,
}) => {
  validateGetSet(hasValue, get, 'get')
  validateGetSet(hasValue, set, 'set')
  validateBoolean(enumerable, 'enumerable')
  validateBoolean(writable, 'writable')
  validateBoolean(configurable, 'configurable')
  validateUnknownProps(unknownProps)
}

const validateGetSet = (hasValue, getSet, propName) => {
  validateFunction(getSet, propName)

  if (hasValue && getSet !== undefined) {
    throw new TypeError(
      `Descriptor property "value" and "${propName}" must not both be defined: ${getSet}`,
    )
  }
}

const validateFunction = (propValue, propName) => {
  if (propValue !== undefined && typeof propValue !== 'function') {
    throw new TypeError(
      `Descriptor property "${propName}" must be a function: ${propValue}`,
    )
  }
}

const validateBoolean = (propValue, propName) => {
  if (propValue !== undefined && typeof propValue !== 'boolean') {
    throw new TypeError(
      `Descriptor property "${propName}" must be a boolean: ${propValue}`,
    )
  }
}

const validateUnknownProps = (unknownProps) => {
  const [unknownProp] = Object.keys(unknownProps)

  if (unknownProp !== undefined) {
    throw new TypeError(
      `Unknown descriptor property "${unknownProp}": ${unknownProps[unknownProp]}`,
    )
  }
}
