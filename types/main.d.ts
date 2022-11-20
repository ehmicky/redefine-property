/**
 *
 * @example
 * ```js
 * ```
 */
export default function redefineProperty<T extends object>(
  object: T,
  key: PropertyKey,
  descriptor: PropertyDescriptor,
): T
