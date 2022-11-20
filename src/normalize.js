import isPlainObj from 'is-plain-obj'

// Normalize and validate arguments
export const normalizeInput = function (value, propName, newDescriptor) {
  if (!isAnyObj(value)) {
    throw new TypeError(`Argument must be an object: ${value}`)
  }

  if (typeof propName !== 'string' && typeof propName !== 'symbol') {
    throw new TypeError(
      `Property key must be a string or a symbol: ${propName}`,
    )
  }

  return normalizeDescriptor(newDescriptor)
}

const isAnyObj = function (value) {
  return typeof value === 'object' && value !== null
}

const normalizeDescriptor = function (newDescriptor = {}) {
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

const validateDescriptor = function ({
  enumerable,
  writable,
  configurable,
  get,
  set,
  unknownProps,
  hasValue,
}) {
  validateBoolean(enumerable, 'enumerable')
  validateBoolean(writable, 'writable')
  validateBoolean(configurable, 'configurable')
  validateGetSet(hasValue, get, 'get')
  validateGetSet(hasValue, set, 'set')
  validateUnknownProps(unknownProps)
}

const validateBoolean = function (propValue, propName) {
  if (propValue !== undefined && typeof propValue !== 'boolean') {
    throw new TypeError(
      `Descriptor property "${propName}" must be a boolean: ${propValue}`,
    )
  }
}

const validateGetSet = function (hasValue, getSet, propName) {
  validateFunction(getSet, propName)

  if (hasValue && getSet !== undefined) {
    throw new TypeError(
      `Descriptor property "value" and "${propName}" must not both be defined: ${getSet}`,
    )
  }
}

const validateFunction = function (propValue, propName) {
  if (propValue !== undefined && typeof propValue !== 'function') {
    throw new TypeError(
      `Descriptor property "${propName}" must be a function: ${propValue}`,
    )
  }
}

const validateUnknownProps = function (unknownProps) {
  const [unknownProp] = Object.keys(unknownProps)

  if (unknownProp !== undefined) {
    throw new TypeError(
      `Unknown descriptor property "${unknownProp}": ${unknownProps[unknownProp]}`,
    )
  }
}
