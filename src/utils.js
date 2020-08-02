import { DOT_PLACEHOLDER, VARIABLE_PATH, OPEN_BRACKET_PLACEHOLDER, CLOSED_BRACKET_PLACEHOLDER, ARRAY_VALUE_SEPARATOR } from './consts'

export function isValidKey(key) {
  return ['number', 'string', 'symbol'].includes(typeof key)
}

export function isObject(o) {
  let ctor, prot

  function _isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  }

  if (_isObject(o) === false) return false
  // If has modified constructor
  ctor = o.constructor
  if (ctor === undefined) return true
  // If has modified prototype
  prot = ctor.prototype
  if (_isObject(prot) === false) return false

  // Most likely a plain Object
  return true
}

export function stringifyArray(arr) {
  return ARRAY_VALUE_SEPARATOR + arr.join(ARRAY_VALUE_SEPARATOR) + ARRAY_VALUE_SEPARATOR
}

export function isStringifiedArray(key) {
  const matches = key.match(new RegExp(ARRAY_VALUE_SEPARATOR, 'gim'))
  return matches && matches.length === 3
}

export function escape(text) {
  return text.replace(/\./gim, DOT_PLACEHOLDER).replace(/\[/gim, OPEN_BRACKET_PLACEHOLDER).replace(/\]/gim, CLOSED_BRACKET_PLACEHOLDER)
}

export function unescape(text) {
  return text.replace(new RegExp(DOT_PLACEHOLDER, 'gim'), '.').replace(new RegExp(OPEN_BRACKET_PLACEHOLDER, 'gim'), '[').replace(new RegExp(CLOSED_BRACKET_PLACEHOLDER, 'gim'), ']')
}

export function splitPath(path) {
  if (Array.isArray(path)) path = path.join('.')
  return String(path)
    .replace(VARIABLE_PATH, escape) // replaces dots by placeholder in variables paths
    .replace(/\.\[/g, '.') // replaces opening .[ by . (prevents faulty paths which would have a dot + brackets)
    .replace(/\[/g, '.') // replaces opening [ by .
    .replace(/^\./, '') // removes any dot at the beginning
    .replace(/]/g, '') // removes closing ]
    .split('.') // split by dots
}
