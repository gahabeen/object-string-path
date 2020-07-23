import { VARIABLE_PATH, ARRAY_VALUE_SEPARATOR, OBJECT_KEY_PREFIX } from './consts'
import { splitPath, isObject, isValidKey, unescape, isStringifiedArray, stringifyArray } from './utils'

export function resolveVariable(context) {
  return (variable) => {
    // console.log('resolveVariable', variable.slice(1, -1), context)
    variable = variable.slice(1, -1)
    if (variable.length > 0) {
      const value = get(context, variable, context)
      if (Array.isArray(value)) {
        return stringifyArray(value)
      } else {
        return value
      }
    } else {
      return 'undefined'
    }
  }
}

export function resolveStep(steps, parent, context) {
  parent = parent || {}
  context = context || {}
  let _step = steps[0]
  const output = {
    step: null,
    _steps: steps.slice(1),
    failed: false,
  }

  if (['array', 'string', 'number'].includes(typeof _step)) {
    _step = '' + _step.trim()

    // Makes sure dots are well set in potential variable paths
    _step = unescape(_step)

    // Clean step prefixes
    _step = _step.replace(OBJECT_KEY_PREFIX, '')

    // Resolve the different variables
    _step = _step.replace(VARIABLE_PATH, resolveVariable(context))

    // console.log('_step', _step, steps, parent, context)
    if (_step.includes('undefined')) {
      output.failed = true
    } // Check for equality condition,
    else if (isStringifiedArray(_step) || _step.includes('=')) {
      const keyValue = isStringifiedArray(_step)
        ? _step.split(ARRAY_VALUE_SEPARATOR).slice(1, -1)
        : _step
            .split('=')
            .filter(Boolean)
            .map((text) => text.trim())

      // console.log('_step =======', keyValue)
      if (keyValue.length === 2) {
        const [key, value] = keyValue
        const index = getIndexByChildKeyValue(parent, key, value)
        if (index !== undefined) {
          output.step = index
        } else {
          output.failed = true
          /* istanbul ignore next */
          console.warn(`Couldn't not find any index for ${key}=${value}`)
        }
      } else {
        output.failed = true
        /* istanbul ignore next */
        console.warn(`Missing key or value to search for (keyValue:'${keyValue})`)
      }
    } else if (isValidKey(_step)) {
      output.step = _step
    } else {
      /* istanbul ignore next */
      output.failed = true // Not sure if this can hit tbh
    }
  } else {
    output.failed = true
    console.warn(`Propery couldn't be found (step: '${_step}' and type is: '${typeof _step}')`)
  }

  return output
}

export function getIndexByChildKeyValue(iterable, key, value) {
  for (let prop of Object.keys(iterable)) {
    if (isObject(iterable[prop]) && iterable[prop][key] == value) {
      return prop
    }
  }
}

export function hasProp(obj, key) {
  if (isValidKey(key) && (isObject(obj) || Array.isArray(obj))) {
    return key in obj
  } else {
    return false
  }
}

export function getProp(obj, key) {
  if (isValidKey(key) && (isObject(obj) || Array.isArray(obj))) {
    return obj[key]
  } else if (obj && key === undefined) {
    return obj
  } else {
    return // error
  }
}

export function setProp(obj, key, value) {
  if (isValidKey(key) && (isObject(obj) || Array.isArray(obj))) {
    obj[key] = value
    return obj[key]
  } else if (obj && key == undefined) {
    if (isObject(value)) {
      Object.assign(obj, value)
    } else {
      obj = value
    }
    return obj
  } else {
    console.log(`Couldn't not set ${key}`)
    return
  }
}

export function makeHas(options) {
  options = {
    hasProp,
    getProp,
    getSteps: splitPath,
    ...(options || {}),
  }

  return function (obj, path, context) {
    const steps = options.getSteps(path)
    // console.log('path', path, steps)

    function _has(_obj, _steps) {
      // console.log("_has", _obj, _steps);
      if (_steps.length > 0) {
        const { step, _steps: __steps, failed } = resolveStep(_steps, _obj, context)
        // console.log('step', step, '_steps', _steps, "failed", failed)
        if (!failed) {
          // console.log('options.hasProp(_obj, step)', options.hasProp(_obj, step), _obj, step)
          return options.hasProp(_obj, step) && _has(options.getProp(_obj, step), __steps)
        } else {
          return false
        }
      } else {
        return true
      }
    }

    return _has(obj, steps)
  }
}

/**
 * forms.{$route.params.ref}
 * forms.slug={$route.params.ref}.
 */

export function makeGet(options) {
  options = {
    getProp,
    hasProp,
    getSteps: splitPath,
    ...(options || {}),
  }

  return function (obj, path, context) {
    const steps = options.getSteps(path)

    function _get(_obj, _steps) {
      if (_steps.length > 0) {
        const { step, _steps: __steps, failed } = resolveStep(_steps, _obj, context)

        if (!failed && options.hasProp(_obj, step)) {
          return _get(options.getProp(_obj, step), __steps)
        } else {
          return
        }
      } else {
        return _obj
      }
    }

    return _get(obj, steps)
  }
}

export function makeSet(options) {
  options = {
    setProp,
    getProp,
    hasProp,
    getSteps: splitPath,
    ...(options || {}),
  }

  return function (obj, path, value, context) {
    const steps = options.getSteps(path)

    const _set = (_obj, _steps, _value) => {
      // console.log("_set", _obj, _steps, _value);
      if (_steps.length > 0) {
        const { step, _steps: __steps, failed } = resolveStep(_steps, _obj, context)
        // console.log("resolveStep", step, __steps, failed);
        if (failed) {
          return
        } else if (__steps.length > 0) {
          const nextObj = options.getProp(_obj, step)
          const { step: nextStep } = resolveStep(__steps, nextObj, context)
          if (Number.isInteger(+nextStep) && !isObject(nextObj)) {
            // Sub prop exists and is an array
            if (options.hasProp(_obj, step) && Array.isArray(nextObj)) {
              _set(nextObj, __steps, _value)
            }
            // Sub prop doesn't exists and should an array
            else {
              _set(options.setProp(_obj, step, []), __steps, _value)
            }
          }
          // Sub prop exists and is an object
          else if (options.hasProp(_obj, step) && isObject(nextObj)) {
            // console.log("setting", _obj, step, options.getProp(_obj, step), __steps);
            _set(options.getProp(_obj, step), __steps, _value)
          }
          // Sub prop doesn't exists and should be an object
          else {
            _set(options.setProp(_obj, step, {}), __steps, _value)
          }
        } else {
          options.setProp(_obj, step, _value)
        }
      } else {
        options.setProp(_obj, undefined, _value)
      }
    }

    _set(obj, steps, value)
  }
}

export const has = makeHas()
export const get = makeGet()
export const set = makeSet()
export * from './utils'
export * from './consts'
