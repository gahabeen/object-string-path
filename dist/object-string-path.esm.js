/*!
  * object-string-path v0.1.41
  * (c) 2020 Gabin Desserprit
  * @license MIT
  */
const OBJECT_KEY_PREFIX = /^\^/;
const VARIABLE_PATH = /({.*?})/gim;
const DOT_REGEX = /\./gim;
const DOT_PLACEHOLDER = '<~~~>';
const SPREAD_REGEX = /\.\./gim;
const SPREAD_PLACEHOLDER = '<~SPREAD~>';
const OPEN_BRACKET_PLACEHOLDER = '<~OBRACK~>';
const CLOSED_BRACKET_PLACEHOLDER = '<~CBRACK~>';
const ARRAY_VALUE_SEPARATOR = '<~ARR~>';

function isValidKey(key) {
  return ['number', 'string', 'symbol'].includes(typeof key)
}

function isObject(o) {
  let ctor, prot;

  function _isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  }

  if (_isObject(o) === false) return false
  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true
  // If has modified prototype
  prot = ctor.prototype;
  if (_isObject(prot) === false) return false

  // Most likely a plain Object
  return true
}

function stringifyArray(arr) {
  return ARRAY_VALUE_SEPARATOR + arr.join(ARRAY_VALUE_SEPARATOR) + ARRAY_VALUE_SEPARATOR
}

function isStringifiedArray(key) {
  const matches = key.match(new RegExp(ARRAY_VALUE_SEPARATOR, 'gim'));
  return matches && matches.length === 3
}

function escape(text) {
  return text.replace(SPREAD_REGEX, SPREAD_PLACEHOLDER).replace(DOT_REGEX, DOT_PLACEHOLDER).replace(/\[/gim, OPEN_BRACKET_PLACEHOLDER).replace(/\]/gim, CLOSED_BRACKET_PLACEHOLDER)
}

function unescape(text) {
  return text.replace(new RegExp(SPREAD_PLACEHOLDER, 'gim'), '..').replace(new RegExp(DOT_PLACEHOLDER, 'gim'), '.').replace(new RegExp(OPEN_BRACKET_PLACEHOLDER, 'gim'), '[').replace(new RegExp(CLOSED_BRACKET_PLACEHOLDER, 'gim'), ']')
}

function splitPath(path) {
  if (Array.isArray(path)) path = path.join('.');
  return String(path)
    .replace(VARIABLE_PATH, escape) // replaces dots by placeholder in variables paths
    .replace(SPREAD_REGEX, escape) // replaces dots by placeholder in variables paths
    .replace(/\.\[/g, '.') // replaces opening .[ by . (prevents faulty paths which would have a dot + brackets)
    .replace(/\[/g, '.') // replaces opening [ by .
    .replace(/^\./, '') // removes any dot at the beginning
    .replace(/]/g, '') // removes closing ]
    .split('.') // split by dots
}

function resolveVariable(context) {
  return (variable) => {
    variable = variable.slice(1, -1);
    if (variable.length > 0) {
      const value = get(context, variable, context);
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

function resolveContext(steps, context) {
  const path = steps.join('.');
  const resolvedContext = {};
  for (let match of path.match(VARIABLE_PATH) || []) {
    resolvedContext[match] = resolveVariable(context)(unescape(match));
  }
  return resolvedContext
}

function resolveStep(steps, parent, context) {
  parent = parent || {};
  context = context || {};
  let _step = steps[0];
  const output = {
    step: null,
    _steps: steps.slice(1),
    failed: false,
  };

  if (['array', 'string', 'number'].includes(typeof _step)) {
    _step = '' + _step.trim();

    // Makes sure dots are well set in potential variable paths
    _step = unescape(_step);

    // Clean step prefixes
    _step = _step.replace(OBJECT_KEY_PREFIX, '');

    // Resolve the different variables
    _step = _step.replace(VARIABLE_PATH, resolveVariable(context));

    if (_step.match(SPREAD_REGEX)) {
      const [_spreadStep, _nextStep, ..._followingSteps] = _step.split(SPREAD_REGEX).filter(Boolean);
      // console.log('_step', _step)
      _step = _spreadStep;
      // Make sure to include all spread operators
      for (let _followingStep of _followingSteps.reverse()) {
        output._steps.unshift('*', _followingStep);
      }

      output._steps.unshift(...['*', _nextStep].filter(Boolean));
      // console.log('output._steps', _step, output._steps)
    }

    // console.log('_step', _step, steps, parent, context)
    if (_step.includes('undefined')) {
      output.failed = true;
    }
    // Check for equality condition,
    else if (isStringifiedArray(_step) || _step.includes('=')) {
      const keyValue = isStringifiedArray(_step)
        ? _step.split(ARRAY_VALUE_SEPARATOR).slice(1, -1)
        : _step
            .split('=')
            .filter(Boolean)
            .map((text) => text.trim());

      // console.log('_step =======', keyValue)
      if (keyValue.length === 2) {
        const [key, value] = keyValue;
        const index = getIndexByChildKeyValue(parent, key, value);
        if (index !== undefined) {
          output.step = index;
        } else {
          output.failed = true;
          /* istanbul ignore next */
          console.warn(`Couldn't not find any index for ${key}=${value}`);
        }
      } else {
        output.failed = true;
        /* istanbul ignore next */
        console.warn(`Missing key or value to search for (keyValue:'${keyValue})`);
      }
    } else if (isValidKey(_step)) {
      output.step = _step;
    } else {
      /* istanbul ignore next */
      output.failed = true; // Not sure if this can hit tbh
    }
  } else {
    output.failed = true;
    console.warn(`Propery couldn't be found (step: '${_step}' and type is: '${typeof _step}')`);
  }

  return output
}

function getIndexByChildKeyValue(iterable, key, value) {
  for (let prop of Object.keys(iterable)) {
    if (isObject(iterable[prop]) && iterable[prop][key] == value) {
      return prop
    }
  }
}

function hasProp(obj, key) {
  if (isValidKey(key) && (isObject(obj) || Array.isArray(obj))) {
    return key in obj
  } else {
    return false
  }
}

function getProp(obj, key) {
  if (isValidKey(key) && (isObject(obj) || Array.isArray(obj))) {
    return obj[key]
  } else if (obj && key === undefined) {
    return obj
  } else {
    return // error
  }
}

function setProp(obj, key, value) {
  if (isValidKey(key) && (isObject(obj) || Array.isArray(obj))) {
    obj[key] = value;
    return obj[key]
  } else if (obj && key == undefined) {
    if (isObject(value)) {
      Object.assign(obj, value);
    } else {
      obj = value;
    }
    return obj
  } else {
    console.log(`Couldn't not set ${key}`);
    return
  }
}

function removeProp(parent, key, context) {
  // console.log('removeProp', { parent, key })
  if (Array.isArray(parent)) {
    parent.splice(+key, 1);
    return true
  } else if (isObject(parent)) {
    delete parent[key];
    return true
  } else {
    // nothing can be done?
    // Handle more types
    return false
  }
}

function makeHas(options) {
  options = {
    hasProp,
    getProp,
    getSteps: splitPath,
    afterGetSteps: (steps) => steps,
    ...(options || {}),
  };

  return function (obj, path, context) {
    const steps = options.afterGetSteps(options.getSteps(path));
    // console.log('path', path, steps)

    function _has(_obj, _steps) {
      // console.log("_has", _obj, _steps);
      if (_steps.length > 0) {
        const { step, _steps: __steps, failed } = resolveStep(_steps, _obj, context);
        // console.log('step', step, '_steps', _steps, "failed", failed)
        if (!failed) {
          if (step === '*') {
            let iterable = null;
            if (isObject(_obj)) {
              iterable = Object.values(_obj);
            } else if (Array.isArray(_obj)) {
              iterable = _obj;
            }
            if (Array.isArray(iterable)) {
              if (__steps.length > 0) {
                return iterable.every((_subObj) => _has(_subObj, __steps))
              }
              // if no following check, default to Boolean test
              else {
                return iterable.every(Boolean)
              }
            } else {
              return false
            }
          } else {
            if (!options.hasProp(_obj, step)) {
              // stop right now, no need to continue
              return false
            } else {
              return _has(options.getProp(_obj, step), __steps)
            }
          }
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

function makeGet(options) {
  options = {
    getProp,
    hasProp,
    getSteps: splitPath,
    afterGetSteps: (steps) => steps,
    proxy: (obj, steps, context, resolvedContext, orGet) => orGet(obj, steps, context),
    ...(options || {}),
  };

  return function (obj, path, context) {
    const steps = options.afterGetSteps(options.getSteps(path));

    function _get(_obj, _steps, _context) {
      if (_steps.length > 0) {
        const { step, _steps: __steps, failed } = resolveStep(_steps, _obj, _context);

        if (!failed) {
          if (step === '*') {
            let iterable = null;
            if (isObject(_obj)) {
              iterable = Object.values(_obj);
            } else if (Array.isArray(_obj)) {
              iterable = _obj;
            }
            if (Array.isArray(iterable)) {
              if (__steps.length > 0) {
                return iterable.map((_subObj) => _get(_subObj, __steps))
              } else {
                return iterable
              }
            } else {
              return
            }
          } else {
            if (options.hasProp(_obj, step)) {
              return _get(options.getProp(_obj, step), __steps, _context)
            } else {
              return
            }
          }
        } else {
          return
        }
      } else {
        return _obj
      }
    }

    const resolvedContext = resolveContext(steps, context);
    return options.proxy(obj, steps, context, resolvedContext, _get)
  }
}

function makeSet(options) {
  options = {
    setProp,
    getProp,
    hasProp,
    getSteps: splitPath,
    afterGetSteps: (steps) => steps,
    ...(options || {}),
  };

  return function (obj, path, value, context) {
    const steps = options.afterGetSteps(options.getSteps(path));

    const _set = (_obj, _steps, _value, _context) => {
      // console.log("_set", _obj, _steps, _value);
      if (_steps.length > 0) {
        const { step, _steps: __steps, failed } = resolveStep(_steps, _obj, _context);
        // console.log("resolveStep", step, __steps, failed);
        if (failed) {
          return
        } else if (step === '*') {
          if (isObject(_obj) || Array.isArray(_obj)) {
            // console.log({ step, __steps, _obj })
            if (__steps.length > 0) {
              for (let key in _obj) {
                // console.log({ item: options.getProp(_obj, key), __steps, _value })
                _set(options.getProp(_obj, key), __steps, _value, _context);
              }
            } else {
              for (let key in _obj) {
                // console.log({ key, _obj, _value })
                options.setProp(_obj, key, _value);
              }
            }
          }
        } else if (__steps.length > 0) {
          const nextObj = options.getProp(_obj, step);
          const { step: nextStep, failed } = resolveStep(__steps, nextObj, _context);
          if (failed) ; else if (nextStep === '*') {
            if (options.hasProp(_obj, step)) {
              _set(options.getProp(_obj, step), __steps, _value, _context);
            }
          } else {
            if (Number.isInteger(+nextStep) && !isObject(nextObj)) {
              // Sub prop exists and is an array
              if (options.hasProp(_obj, step) && Array.isArray(nextObj)) {
                _set(nextObj, __steps, _value, _context);
              }
              // Sub prop doesn't exists and should an array
              else {
                _set(options.setProp(_obj, step, []), __steps, _value, _context);
              }
            }
            // Sub prop exists and is an object
            else if (options.hasProp(_obj, step) && isObject(nextObj)) {
              // console.log("setting", _obj, step, options.getProp(_obj, step), __steps);
              _set(options.getProp(_obj, step), __steps, _value, _context);
            }
            // Sub prop doesn't exists and should be an object
            else {
              _set(options.setProp(_obj, step, {}), __steps, _value, _context);
            }
          }
        } else {
          // console.log({_obj, step, _value});
          options.setProp(_obj, step, _value);
        }
      } else {
        options.setProp(_obj, undefined, _value);
      }
    };

    _set(obj, steps, value, context);
  }
}

function makeRemove(options) {
  options = {
    get: null,
    getProp,
    hasProp,
    removeProp,
    getSteps: splitPath,
    afterGetSteps: (steps) => steps,
    ...(options || {}),
  };

  return function (obj, path, context) {
    const steps = options.afterGetSteps(options.getSteps(path));
    const _get = options.get || makeGet({ getProp: options.getProp, hasProp: options.hasProp, getSteps: options.getSteps });

    function _remove(_obj, _steps, _context) {
      const { step, _steps: __steps, failed } = resolveStep(_steps, _obj, _context);
      // console.log({ step, __steps, failed })

      if (failed) {
        // stop
        return false
      } else if (step === '*') {
        if (isObject(_obj) || Array.isArray(_obj)) {
          return Object.keys(_obj).every((key) => {
            if (__steps.length > 0) {
              return _remove(_get(_obj, key, _context), __steps, _context)
            } else {
              return options.removeProp(_obj, Array.isArray(_obj) ? 0 : key, _context)
            }
          })
        }
      } else if (__steps.length > 0) {
        if (failed) {
          // stop
          return false
        } else {
          return _remove(options.getProp(_obj, step), __steps, _context)
        }
      } else if (options.hasProp(_obj, step)) {
        return options.removeProp(_obj, step, _context)
      } else {
        return false
      }
    }

    return _remove(obj, steps, context)
  }
}

const has = makeHas();
const get = makeGet();
const set = makeSet();
const remove = makeRemove();

export { ARRAY_VALUE_SEPARATOR, CLOSED_BRACKET_PLACEHOLDER, DOT_PLACEHOLDER, DOT_REGEX, OBJECT_KEY_PREFIX, OPEN_BRACKET_PLACEHOLDER, SPREAD_PLACEHOLDER, SPREAD_REGEX, VARIABLE_PATH, escape, get, getIndexByChildKeyValue, getProp, has, hasProp, isObject, isStringifiedArray, isValidKey, makeGet, makeHas, makeRemove, makeSet, remove, removeProp, resolveContext, resolveStep, resolveVariable, set, setProp, splitPath, stringifyArray, unescape };
