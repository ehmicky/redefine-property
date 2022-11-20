// Merge the new descriptor with the current one, if any
export const mergeDescriptors = function (newDescriptor, currentDescriptor) {
  return currentDescriptor.configurable === false
    ? mergeNonConfig(newDescriptor, currentDescriptor)
    : mergeConfig(newDescriptor, currentDescriptor)
}

// Non-configurable properties can still change the `value`, or set `writable`
// from `true` to `false`
const mergeNonConfig = function (newDescriptor, currentDescriptor) {
  return {
    ...currentDescriptor,
    ...getNonConfigWritable(newDescriptor, currentDescriptor),
    ...getNonConfigValue(newDescriptor, currentDescriptor),
  }
}

const getNonConfigWritable = function (newDescriptor, currentDescriptor) {
  return currentDescriptor.writable === true && newDescriptor.writable === false
    ? { writable: false }
    : {}
}

const getNonConfigValue = function (newDescriptor, currentDescriptor) {
  return newDescriptor.hasValue && 'value' in currentDescriptor
    ? { value: newDescriptor.value }
    : {}
}

const mergeConfig = function (newDescriptor, currentDescriptor) {
  const valueProps = mergeValue(newDescriptor, currentDescriptor)
  const enumerable = mergeDescriptor(
    newDescriptor.enumerable,
    currentDescriptor.enumerable,
    true,
  )
  const writable = mergeDescriptor(
    newDescriptor.writable,
    currentDescriptor.writable,
    true,
  )
  const configurable = mergeDescriptor(
    newDescriptor.configurable,
    currentDescriptor.configurable,
    true,
  )
  return { ...valueProps, enumerable, writable, configurable }
}

const mergeValue = function (newDescriptor, currentDescriptor) {
  if (newDescriptor.hasValue) {
    return { value: newDescriptor.value }
  }

  if (!hasGetSet(newDescriptor) && !hasGetSet(currentDescriptor)) {
    return { value: currentDescriptor.value }
  }

  return {
    get: mergeDescriptor(newDescriptor.get, currentDescriptor.get),
    set: mergeDescriptor(newDescriptor.set, currentDescriptor.set),
  }
}

const hasGetSet = function ({ get, set }) {
  return get !== undefined || set !== undefined
}

const mergeDescriptor = function (newValue, currentValue, defaultValue) {
  return newValue ?? currentValue ?? defaultValue
}
