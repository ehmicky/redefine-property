import { mergeDescriptors } from './merge.js'
import { normalizeInput } from './normalize.js'

// Better `Object.defineProperty()`
export default function redefineProperty(value, propName, newDescriptor) {
  const newDescriptorA = normalizeInput(value, propName, newDescriptor)
  const currentDescriptor = getCurrentDescriptor(value, propName)
  const finalDescriptor = mergeDescriptors(newDescriptorA, currentDescriptor)
  setProperty(value, propName, finalDescriptor)
  return value
}

// Retrieve current descriptor (if any) even on inherited properties
const getCurrentDescriptor = function (value, propName) {
  const descriptor = Object.getOwnPropertyDescriptor(value, propName)

  if (descriptor !== undefined) {
    return descriptor
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null ? {} : getCurrentDescriptor(prototype, propName)
}

// This might throw when using `Proxy`, etc.
const setProperty = function (value, propName, finalDescriptor) {
  try {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(value, propName, finalDescriptor)
  } catch {}
}
