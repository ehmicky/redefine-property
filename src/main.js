import { mergeDescriptors } from './merge.js'
import { normalizeInput } from './normalize.js'

// Better `Object.defineProperty()`
const redefineProperty = (input, key, newDescriptor) => {
  const newDescriptorA = normalizeInput(input, key, newDescriptor)
  const currentDescriptor = getCurrentDescriptor(input, key)
  const finalDescriptor = mergeDescriptors(newDescriptorA, currentDescriptor)
  setProperty(input, key, finalDescriptor)
  return input
}

export default redefineProperty

// Retrieve current descriptor (if any) even on inherited properties
const getCurrentDescriptor = (input, key) => {
  const descriptor = Object.getOwnPropertyDescriptor(input, key)

  if (descriptor !== undefined) {
    return descriptor
  }

  const prototype = Object.getPrototypeOf(input)
  return prototype === null ? {} : getCurrentDescriptor(prototype, key)
}

// This might throw when using `Proxy`, etc.
const setProperty = (input, key, finalDescriptor) => {
  try {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(input, key, finalDescriptor)
  } catch {}
}
