function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function camelToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function pascalToDash(str) {
  return camelToDash(str.replace(/((?!([A-Z]{2}|^))[A-Z])/g, '-$1'));
}
function dispatch(host, eventType) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return host.dispatchEvent(new CustomEvent(eventType, _objectSpread({
    bubbles: false
  }, options)));
}
function shadyCSS(fn, fallback) {
  var shady = window.ShadyCSS;
  /* istanbul ignore next */

  if (shady && !shady.nativeShadow) {
    return fn(shady);
  }

  return fallback;
}
function stringifyElement(element) {
  var tagName = String(element.tagName).toLowerCase();
  return "<".concat(tagName, ">");
}
var IS_IE = 'ActiveXObject' in window;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var defaultTransform = function defaultTransform(v) {
  return v;
};

var objectTransform = function objectTransform(value) {
  if (_typeof(value) !== 'object') {
    throw TypeError("Assigned value must be an object: ".concat(typeof v === "undefined" ? "undefined" : _typeof(v)));
  }

  return value && Object.freeze(value);
};

function property(value, connect) {
  var type = _typeof(value);

  var transform = defaultTransform;

  switch (type) {
    case 'string':
      transform = String;
      break;

    case 'number':
      transform = Number;
      break;

    case 'boolean':
      transform = Boolean;
      break;

    case 'function':
      transform = value;
      value = transform();
      break;

    case 'object':
      if (value) Object.freeze(value);
      transform = objectTransform;
      break;

    default:
      break;
  }

  return {
    get: function get(host) {
      var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : value;
      return val;
    },
    set: function set(host, val, oldValue) {
      return transform(val, oldValue);
    },
    connect: type !== 'object' && type !== 'undefined' ? function (host, key, invalidate) {
      if (host[key] === value) {
        var attrName = camelToDash(key);

        if (host.hasAttribute(attrName)) {
          var attrValue = host.getAttribute(attrName);
          host[key] = attrValue !== '' ? attrValue : true;
        }
      }

      return connect && connect(host, key, invalidate);
    } : connect
  };
}

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }
var map = new WeakMap();
var cache = new WeakMap();
var FPS_THRESHOLD = 1000 / 60; // 60 FPS ~ 16,67ms time window

var queue = [];
function update() {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var startTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (startTime && performance.now() - startTime > FPS_THRESHOLD) {
    requestAnimationFrame(function () {
      return update(index);
    });
  } else {
    var target = queue[index];
    var nextTime = performance.now();

    if (!target) {
      shadyCSS(function (shady) {
        return queue.forEach(function (t) {
          return shady.styleSubtree(t);
        });
      });
      queue = [];
    } else {
      if (map.has(target)) {
        var key = map.get(target);
        var prevUpdate = cache.get(target);

        try {
          var nextUpdate = target[key];

          if (nextUpdate !== prevUpdate) {
            cache.set(target, nextUpdate);
            nextUpdate();
            if (!prevUpdate) shadyCSS(function (shady) {
              return shady.styleElement(target);
            });
          }
        } catch (e) {
          update(index + 1, nextTime);
          throw e;
        }
      }

      update(index + 1, nextTime);
    }
  }
}

function addToQueue(event) {
  var target = event.composedPath()[0];

  if (target === event.currentTarget) {
    if (!queue[0]) {
      requestAnimationFrame(function () {
        return update();
      });
    }

    if (queue.indexOf(target) === -1) {
      queue.push(target);
    }
  }
}

function render(_get) {
  var customOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof _get !== 'function') {
    throw TypeError("The first argument must be a function: ".concat(_typeof$1(_get)));
  }

  var options = _objectSpread$1({
    shadowRoot: true
  }, customOptions);

  return {
    get: function get(host) {
      var fn = _get(host);

      return function () {
        return fn(host, options.shadowRoot ? host.shadowRoot : host);
      };
    },
    connect: function connect(host, key) {
      if (map.has(host)) {
        throw Error("Render factory already used in '".concat(map.get(host), "' key"));
      }

      if (options.shadowRoot && !host.shadowRoot) {
        var shadowRootInit = {
          mode: 'open'
        };

        if (_typeof$1(options.shadowRoot) === 'object') {
          Object.assign(shadowRootInit, options.shadowRoot);
        }

        host.attachShadow(shadowRootInit);
      }

      host.addEventListener('@invalidate', addToQueue);
      map.set(host, key);
      return function () {
        host.removeEventListener('@invalidate', addToQueue);
        map.delete(host);
      };
    }
  };
}

var entries = new WeakMap();
function getEntry(target, key) {
  var targetMap = entries.get(target);

  if (!targetMap) {
    targetMap = new Map();
    entries.set(target, targetMap);
  }

  var entry = targetMap.get(key);

  if (!entry) {
    entry = {
      target: target,
      key: key,
      value: undefined,
      deps: new Set(),
      state: 1,
      checksum: 0
    };
    targetMap.set(key, entry);
  }

  return entry;
}

function calculateChecksum(_ref) {
  var state = _ref.state,
      deps = _ref.deps;
  var checksum = state;
  deps.forEach(function (entry) {
    // eslint-disable-next-line no-unused-expressions
    entry.target[entry.key];
    checksum += entry.state;
  });
  return checksum;
}

var context = null;
function get(target, key, getter) {
  var entry = getEntry(target, key);

  if (context === entry) {
    context = null;
    throw Error("Circular '".concat(key, "' get invocation in '").concat(stringifyElement(target), "'"));
  }

  if (context) {
    context.deps.add(entry);
  }

  var parentContext = context;
  context = entry;

  if (entry.checksum && entry.checksum === calculateChecksum(entry)) {
    context = parentContext;
    return entry.value;
  }

  entry.deps.clear();

  try {
    var nextValue = getter(target, entry.value);

    if (nextValue !== entry.value) {
      entry.state += 1;
      entry.value = nextValue;
    }

    entry.checksum = calculateChecksum(entry);
    context = parentContext;
  } catch (e) {
    context = null;
    throw e;
  }

  return entry.value;
}
function set(target, key, setter, value, callback) {
  if (context) {
    context = null;
    throw Error("Try to set '".concat(key, "' of '").concat(stringifyElement(target), "' in get call"));
  }

  var entry = getEntry(target, key);
  var newValue = setter(target, value, entry.value);

  if (newValue !== entry.value) {
    entry.state += 1;
    entry.value = newValue;
    callback();
  }
}
function invalidate(target, key, clearValue) {
  if (context) {
    context = null;
    throw Error("Try to invalidate '".concat(key, "' in '").concat(stringifyElement(target), "' get call"));
  }

  var entry = getEntry(target, key);
  entry.checksum = 0;

  if (clearValue) {
    entry.value = undefined;
  }
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof$2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }


function dispatchInvalidate(host) {
  dispatch(host, '@invalidate', {
    bubbles: true,
    composed: true
  });
}

var defaultMethod = function defaultMethod(host, value) {
  return value;
};

function compile(Hybrid, hybrids) {
  Hybrid.hybrids = hybrids;
  Hybrid.connects = [];
  Object.keys(hybrids).forEach(function (key) {
    var value = hybrids[key];

    var type = _typeof$2(value);

    var config;

    if (type === 'function') {
      config = key === 'render' ? render(value) : {
        get: value
      };
    } else if (value === null || type !== 'object' || type === 'object' && !value.get && !value.set && !value.connect) {
      config = property(value);
    } else {
      config = {
        get: value.get || defaultMethod,
        set: value.set || !value.get && defaultMethod || undefined,
        connect: value.connect
      };
    }

    Object.defineProperty(Hybrid.prototype, key, {
      get: function get$1() {
        return get(this, key, config.get);
      },
      set: config.set && function set$1(newValue) {
        var _this = this;

        set(this, key, config.set, newValue, function () {
          return dispatchInvalidate(_this);
        });
      },
      enumerable: true,
      configurable: "development" !== 'production'
    });

    if (config.connect) {
      Hybrid.connects.push(function (host) {
        return config.connect(host, key, function () {
          var clearCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          if (clearCache) invalidate(host, key);
          dispatchInvalidate(host);
        });
      });
    }
  });
}

var update$1;
/* istanbul ignore else */

{
  var walkInShadow = function walkInShadow(node, fn) {
    fn(node);
    Array.from(node.children).forEach(function (el) {
      return walkInShadow(el, fn);
    });

    if (node.shadowRoot) {
      Array.from(node.shadowRoot.children).forEach(function (el) {
        return walkInShadow(el, fn);
      });
    }
  };

  var updateQueue = new Map();

  update$1 = function update(Hybrid, lastHybrids) {
    if (!updateQueue.size) {
      Promise.resolve().then(function () {
        walkInShadow(document.body, function (node) {
          if (updateQueue.has(node.constructor)) {
            var hybrids = updateQueue.get(node.constructor);
            node.disconnectedCallback();
            Object.keys(node.constructor.hybrids).forEach(function (key) {
              invalidate(node, key, node[key] === hybrids[key]);
            });
            node.connectedCallback();
            dispatchInvalidate(node);
          }
        });
        updateQueue.clear();
      });
    }

    updateQueue.set(Hybrid, lastHybrids);
  };
}

var connects = new WeakMap();

function defineElement(tagName, hybridsOrConstructor) {
  var type = _typeof$2(hybridsOrConstructor);

  if (type !== 'object' && type !== 'function') {
    throw TypeError("Second argument must be an object or a function: ".concat(type));
  }

  var CustomElement = window.customElements.get(tagName);

  if (type === 'function') {
    if (CustomElement !== hybridsOrConstructor) {
      return window.customElements.define(tagName, hybridsOrConstructor);
    }

    return CustomElement;
  }

  if (CustomElement) {
    if (CustomElement.hybrids === hybridsOrConstructor) {
      return CustomElement;
    }

    if (CustomElement.hybrids) {
      Object.keys(CustomElement.hybrids).forEach(function (key) {
        delete CustomElement.prototype[key];
      });
      var lastHybrids = CustomElement.hybrids;
      compile(CustomElement, hybridsOrConstructor);
      update$1(CustomElement, lastHybrids);
      return CustomElement;
    }

    throw Error("Element '".concat(tagName, "' already defined"));
  }

  var Hybrid =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(Hybrid, _HTMLElement);

    function Hybrid() {
      _classCallCheck(this, Hybrid);

      return _possibleConstructorReturn(this, _getPrototypeOf(Hybrid).apply(this, arguments));
    }

    _createClass(Hybrid, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this2 = this;

        var list = this.constructor.connects.reduce(function (acc, fn) {
          var result = fn(_this2);
          if (result) acc.add(result);
          return acc;
        }, new Set());
        connects.set(this, list);
        dispatchInvalidate(this);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var list = connects.get(this);
        list.forEach(function (fn) {
          return fn();
        });
      }
    }], [{
      key: "name",
      get: function get() {
        return tagName;
      }
    }]);

    return Hybrid;
  }(_wrapNativeSuper(HTMLElement));

  compile(Hybrid, hybridsOrConstructor);
  customElements.define(tagName, Hybrid);
  return Hybrid;
}

function defineMap(elements) {
  return Object.keys(elements).reduce(function (acc, key) {
    var tagName = pascalToDash(key);
    acc[key] = defineElement(tagName, elements[key]);
    return acc;
  }, {});
}

function define() {
  if (_typeof$2(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
    return defineMap(arguments.length <= 0 ? undefined : arguments[0]);
  }

  return defineElement.apply(void 0, arguments);
}

var map$1 = new WeakMap();
document.addEventListener('@invalidate', function (event) {
  var set = map$1.get(event.composedPath()[0]);
  if (set) set.forEach(function (fn) {
    return fn();
  });
});

function walk(node, fn) {
  var parentElement = node.parentElement || node.parentNode.host;

  while (parentElement) {
    var hybrids = parentElement.constructor.hybrids;

    if (hybrids && fn(hybrids)) {
      return parentElement;
    }

    parentElement = parentElement.parentElement || parentElement.parentNode && parentElement.parentNode.host;
  }

  return parentElement || null;
}

function parent(hybridsOrFn) {
  var fn = typeof hybridsOrFn === 'function' ? hybridsOrFn : function (hybrids) {
    return hybrids === hybridsOrFn;
  };
  return {
    get: function get(host) {
      return walk(host, fn);
    },
    connect: function connect(host, key, invalidate) {
      var target = host[key];

      if (target) {
        var set = map$1.get(target);

        if (!set) {
          set = new Set();
          map$1.set(target, set);
        }

        set.add(invalidate);
        return function () {
          set.delete(invalidate);
          invalidate();
        };
      }

      return false;
    }
  };
}

function walk$1(node, fn, options) {
  var items = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  Array.from(node.children).forEach(function (child) {
    var hybrids = child.constructor.hybrids;

    if (hybrids && fn(hybrids)) {
      items.push(child);

      if (options.deep && options.nested) {
        walk$1(child, fn, options, items);
      }
    } else if (options.deep) {
      walk$1(child, fn, options, items);
    }
  });
  return items;
}

function children(hybridsOrFn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    deep: false,
    nested: false
  };
  var fn = typeof hybridsOrFn === 'function' ? hybridsOrFn : function (hybrids) {
    return hybrids === hybridsOrFn;
  };
  return {
    get: function get(host) {
      return walk$1(host, fn, options);
    },
    connect: function connect(host, key, invalidate) {
      var observer = new MutationObserver(invalidate);
      var set = new Set();

      var childEventListener = function childEventListener(_ref) {
        var target = _ref.target;

        if (!set.size) {
          Promise.resolve().then(function () {
            var list = host[key];

            for (var i = 0; i < list.length; i += 1) {
              if (set.has(list[i])) {
                invalidate(false);
                break;
              }
            }

            set.clear();
          });
        }

        set.add(target);
      };

      observer.observe(host, {
        childList: true,
        subtree: !!options.deep
      });
      host.addEventListener('@invalidate', childEventListener);
      return function () {
        observer.disconnect();
        host.removeEventListener('@invalidate', childEventListener);
      };
    }
  };
}

var map$2 = new WeakMap();
var dataMap = {
  get: function get(key, defaultValue) {
    if (map$2.has(key)) {
      return map$2.get(key);
    }

    if (defaultValue !== undefined) {
      map$2.set(key, defaultValue);
    }

    return defaultValue;
  },
  set: function set(key, value) {
    map$2.set(key, value);
    return value;
  }
};
function getTemplateEnd(node) {
  var data; // eslint-disable-next-line no-cond-assign

  while (node && (data = dataMap.get(node)) && data.endNode) {
    node = data.endNode;
  }

  return node;
}
function removeTemplate(target) {
  var data = dataMap.get(target);
  var startNode = data.startNode;

  if (startNode) {
    var endNode = getTemplateEnd(data.endNode);
    var node = startNode;
    var lastNextSibling = endNode.nextSibling;

    while (node) {
      var nextSibling = node.nextSibling;
      node.parentNode.removeChild(node);
      node = nextSibling !== lastNextSibling && nextSibling;
    }
  }
}

var arrayMap = new WeakMap();

function movePlaceholder(target, previousSibling) {
  var data = dataMap.get(target);
  var startNode = data.startNode;
  var endNode = getTemplateEnd(data.endNode);
  previousSibling.parentNode.insertBefore(target, previousSibling.nextSibling);
  var prevNode = target;
  var node = startNode;

  while (node) {
    var nextNode = node.nextSibling;
    prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
    prevNode = node;
    node = nextNode !== endNode.nextSibling && nextNode;
  }
}

function resolveArray(host, target, value) {
  var lastEntries = arrayMap.get(target);
  var entries = value.map(function (item, index) {
    return {
      id: Object.prototype.hasOwnProperty.call(item, 'id') ? item.id : index,
      value: item,
      placeholder: null,
      available: true
    };
  });
  arrayMap.set(target, entries);

  if (lastEntries) {
    var ids = new Set();
    entries.forEach(function (entry) {
      return ids.add(entry.id);
    });
    lastEntries = lastEntries.filter(function (entry) {
      if (!ids.has(entry.id)) {
        removeTemplate(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
        return false;
      }

      return true;
    });
  }

  var previousSibling = target;
  var lastIndex = value.length - 1;
  var data = dataMap.get(target);
  entries.forEach(function (entry, index) {
    var matchedEntry = lastEntries && lastEntries.find(function (item) {
      return item.available && item.id === entry.id;
    });
    var placeholder;

    if (matchedEntry) {
      matchedEntry.available = false;
      placeholder = matchedEntry.placeholder;

      if (placeholder.previousSibling !== previousSibling) {
        movePlaceholder(placeholder, previousSibling);
      }

      if (matchedEntry.value !== entry.value) {
        resolveValue(host, placeholder, entry.value);
      }
    } else {
      placeholder = document.createTextNode('');
      previousSibling.parentNode.insertBefore(placeholder, previousSibling.nextSibling);
      resolveValue(host, placeholder, entry.value);
    }

    previousSibling = getTemplateEnd(dataMap.get(placeholder).endNode || placeholder);
    if (index === 0) data.startNode = placeholder;
    if (index === lastIndex) data.endNode = previousSibling;
    entry.placeholder = placeholder;
  });

  if (lastEntries) {
    lastEntries.forEach(function (entry) {
      if (entry.available) {
        removeTemplate(entry.placeholder);
        entry.placeholder.parentNode.removeChild(entry.placeholder);
      }
    });
  }
}

function _typeof$3(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }
function resolveValue(host, target, value) {
  var type = Array.isArray(value) ? 'array' : _typeof$3(value);
  var data = dataMap.get(target, {});

  if (data.type !== type) {
    removeTemplate(target);
    if (type === 'array') arrayMap.delete(target);
    data = dataMap.set(target, {
      type: type
    });

    if (target.textContent !== '') {
      target.textContent = '';
    }
  }

  switch (type) {
    case 'function':
      value(host, target);
      break;

    case 'array':
      resolveArray(host, target, value);
      break;

    default:
      target.textContent = type === 'number' || value ? value : '';
  }
}

function _typeof$4(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

var eventMap = new WeakMap();
function resolveEventListener(eventType) {
  return function (host, target, value, lastValue) {
    if (lastValue) {
      target.removeEventListener(eventType, eventMap.get(lastValue), lastValue.options !== undefined ? lastValue.options : false);
    }

    if (value) {
      if (typeof value !== 'function') {
        throw Error("Event listener must be a function: ".concat(_typeof$4(value)));
      }

      eventMap.set(value, value.bind(null, host));
      target.addEventListener(eventType, eventMap.get(value), value.options !== undefined ? value.options : false);
    }
  };
}

function _typeof$5(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$5 = function _typeof(obj) { return typeof obj; }; } else { _typeof$5 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$5(obj); }

function normalizeValue(value) {
  var set = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

  if (Array.isArray(value)) {
    value.forEach(function (className) {
      return set.add(className);
    });
  } else if (value !== null && _typeof$5(value) === 'object') {
    Object.keys(value).forEach(function (key) {
      return value[key] && set.add(key);
    });
  } else {
    set.add(value);
  }

  return set;
}

var classMap = new WeakMap();
function resolveClassList(host, target, value) {
  var previousList = classMap.get(target) || new Set();
  var list = normalizeValue(value);
  classMap.set(target, list);
  list.forEach(function (className) {
    target.classList.add(className);
    previousList.delete(className);
  });
  previousList.forEach(function (className) {
    target.classList.remove(className);
  });
}

function _typeof$6(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$6 = function _typeof(obj) { return typeof obj; }; } else { _typeof$6 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$6(obj); }
var styleMap = new WeakMap();
function resolveStyle(host, target, value) {
  if (value === null || _typeof$6(value) !== 'object') {
    throw TypeError("Style value must be an object in ".concat(stringifyElement(target), ":"), value);
  }

  var previousMap = styleMap.get(target) || new Map();
  var nextMap = Object.keys(value).reduce(function (map, key) {
    var dashKey = camelToDash(key);
    var styleValue = value[key];

    if (!styleValue && styleValue !== 0) {
      target.style.removeProperty(dashKey);
    } else {
      target.style.setProperty(dashKey, styleValue);
    }

    map.set(dashKey, styleValue);
    previousMap.delete(dashKey);
    return map;
  }, new Map());
  previousMap.forEach(function (styleValue, key) {
    target.style[key] = '';
  });
  styleMap.set(target, nextMap);
}

function resolveProperty(attrName, propertyName, isSVG) {
  if (propertyName.substr(0, 2) === 'on') {
    var eventType = propertyName.substr(2);
    return resolveEventListener(eventType);
  }

  switch (attrName) {
    case 'class':
      return resolveClassList;

    case 'style':
      return resolveStyle;

    default:
      return function (host, target, value) {
        if (!isSVG && !(target instanceof SVGElement) && propertyName in target) {
          if (target[propertyName] !== value) {
            target[propertyName] = value;
          }
        } else if (value === false || value === undefined || value === null) {
          target.removeAttribute(attrName);
        } else {
          var attrValue = value === true ? '' : String(value);
          target.setAttribute(attrName, attrValue);
        }
      };
  }
}

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof$7(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$7 = function _typeof(obj) { return typeof obj; }; } else { _typeof$7 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$7(obj); }


var TIMESTAMP = Date.now();
var getPlaceholder = function getPlaceholder() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return "{{h-".concat(TIMESTAMP, "-").concat(id, "}}");
};
var PLACEHOLDER_REGEXP_TEXT = getPlaceholder('(\\d+)');
var PLACEHOLDER_REGEXP_EQUAL = new RegExp("^".concat(PLACEHOLDER_REGEXP_TEXT, "$"));
var PLACEHOLDER_REGEXP_ALL = new RegExp(PLACEHOLDER_REGEXP_TEXT, 'g');
var ATTR_PREFIX = "--".concat(TIMESTAMP, "--");
var ATTR_REGEXP = new RegExp(ATTR_PREFIX, 'g');
var preparedTemplates = new WeakMap();
/* istanbul ignore next */

function applyShadyCSS(template, tagName) {
  if (!tagName) return template;
  return shadyCSS(function (shady) {
    var map = preparedTemplates.get(template);

    if (!map) {
      map = new Map();
      preparedTemplates.set(template, map);
    }

    var clone = map.get(tagName);

    if (!clone) {
      clone = document.createElement('template');
      clone.content.appendChild(template.content.cloneNode(true));
      map.set(tagName, clone);
      var styles = clone.content.querySelectorAll('style');
      Array.from(styles).forEach(function (style) {
        var count = style.childNodes.length + 1;

        for (var i = 0; i < count; i += 1) {
          style.parentNode.insertBefore(document.createTextNode(getPlaceholder()), style);
        }
      });
      shady.prepareTemplate(clone, tagName.toLowerCase());
    }

    return clone;
  }, template);
}

function createSignature(parts, styles) {
  var signature = parts.reduce(function (acc, part, index) {
    if (index === 0) {
      return part;
    }

    if (parts.slice(index).join('').match(/^\s*<\/\s*(table|tr|thead|tbody|tfoot|colgroup)>/)) {
      return "".concat(acc, "<!--").concat(getPlaceholder(index - 1), "-->").concat(part);
    }

    return acc + getPlaceholder(index - 1) + part;
  }, '');

  if (styles) {
    signature += "<style>\n".concat(styles.join('\n/*------*/\n'), "\n</style>");
  }
  /* istanbul ignore if */


  if (IS_IE) {
    return signature.replace(/style\s*=\s*(["][^"]+["]|['][^']+[']|[^\s"'<>/]+)/g, function (match) {
      return "".concat(ATTR_PREFIX).concat(match);
    });
  }

  return signature;
}

function getPropertyName(string) {
  return string.replace(/\s*=\s*['"]*$/g, '').split(' ').pop();
}

function replaceComments(fragment) {
  var iterator = document.createNodeIterator(fragment, NodeFilter.SHOW_COMMENT, null, false);
  var node; // eslint-disable-next-line no-cond-assign

  while (node = iterator.nextNode()) {
    if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
      node.parentNode.insertBefore(document.createTextNode(node.textContent), node);
      node.parentNode.removeChild(node);
    }
  }
}

function createInternalWalker(context) {
  var node;
  return {
    get currentNode() {
      return node;
    },

    nextNode: function nextNode() {
      if (node === undefined) {
        node = context.childNodes[0];
      } else if (node.childNodes.length) {
        node = node.childNodes[0];
      } else if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        node = node.parentNode.nextSibling;
      }

      return !!node;
    }
  };
}

function createExternalWalker(context) {
  return document.createTreeWalker(context, // eslint-disable-next-line no-bitwise
  NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
}
/* istanbul ignore next */


var createWalker = _typeof$7(window.ShadyDOM) === 'object' && window.ShadyDOM.inUse ? createInternalWalker : createExternalWalker;
var container = document.createElement('div');
function compile$1(rawParts, isSVG, styles) {
  var template = document.createElement('template');
  var parts = [];
  var signature = createSignature(rawParts, styles);
  if (isSVG) signature = "<svg>".concat(signature, "</svg>");
  /* istanbul ignore if */

  if (IS_IE) {
    template.innerHTML = signature;
  } else {
    container.innerHTML = "<template>".concat(signature, "</template>");
    template.content.appendChild(container.children[0].content);
  }

  if (isSVG) {
    var svgRoot = template.content.firstChild;
    template.content.removeChild(svgRoot);
    Array.from(svgRoot.childNodes).forEach(function (node) {
      return template.content.appendChild(node);
    });
  }

  replaceComments(template.content);
  var compileWalker = createWalker(template.content);
  var compileIndex = 0;

  var _loop = function _loop() {
    var node = compileWalker.currentNode;

    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;

      if (!text.match(PLACEHOLDER_REGEXP_EQUAL)) {
        var results = text.match(PLACEHOLDER_REGEXP_ALL);

        if (results) {
          var currentNode = node;
          results.reduce(function (acc, placeholder) {
            var _acc$pop$split = acc.pop().split(placeholder),
                _acc$pop$split2 = _slicedToArray(_acc$pop$split, 2),
                before = _acc$pop$split2[0],
                next = _acc$pop$split2[1];

            if (before) acc.push(before);
            acc.push(placeholder);
            if (next) acc.push(next);
            return acc;
          }, [text]).forEach(function (part, index) {
            if (index === 0) {
              currentNode.textContent = part;
            } else {
              currentNode = currentNode.parentNode.insertBefore(document.createTextNode(part), currentNode.nextSibling);
            }
          });
        }
      }

      var equal = node.textContent.match(PLACEHOLDER_REGEXP_EQUAL);

      if (equal) {
        /* istanbul ignore else */
        if (!IS_IE) node.textContent = '';
        parts[equal[1]] = [compileIndex, resolveValue];
      }
    } else {
      /* istanbul ignore else */
      // eslint-disable-next-line no-lonely-if
      if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.attributes).forEach(function (attr) {
          var value = attr.value.trim();
          /* istanbul ignore next */

          var name = IS_IE ? attr.name.replace(ATTR_PREFIX, '') : attr.name;
          var equal = value.match(PLACEHOLDER_REGEXP_EQUAL);

          if (equal) {
            var propertyName = getPropertyName(rawParts[equal[1]]);
            parts[equal[1]] = [compileIndex, resolveProperty(name, propertyName, isSVG)];
            node.removeAttribute(attr.name);
          } else {
            var _results = value.match(PLACEHOLDER_REGEXP_ALL);

            if (_results) {
              var partialName = "attr__".concat(name);

              _results.forEach(function (placeholder, index) {
                var _placeholder$match = placeholder.match(PLACEHOLDER_REGEXP_EQUAL),
                    _placeholder$match2 = _slicedToArray(_placeholder$match, 2),
                    id = _placeholder$match2[1];

                parts[id] = [compileIndex, function (host, target, attrValue) {
                  var data = dataMap.get(target, {});
                  data[partialName] = (data[partialName] || value).replace(placeholder, attrValue == null ? '' : attrValue);

                  if (_results.length === 1 || index + 1 === _results.length) {
                    target.setAttribute(name, data[partialName]);
                    data[partialName] = undefined;
                  }
                }];
              });

              attr.value = '';
              /* istanbul ignore next */

              if (IS_IE && name !== attr.name) {
                node.removeAttribute(attr.name);
                node.setAttribute(name, '');
              }
            }
          }
        });
      }
    }

    compileIndex += 1;
  };

  while (compileWalker.nextNode()) {
    _loop();
  }

  return function (host, target, args) {
    var data = dataMap.get(target, {
      type: 'function'
    });

    if (template !== data.template) {
      if (data.template) removeTemplate(target);
      var fragment = document.importNode(applyShadyCSS(template, host.tagName).content, true);
      var renderWalker = createWalker(fragment);
      var clonedParts = parts.slice(0);
      var renderIndex = 0;
      var currentPart = clonedParts.shift();
      var markers = [];
      Object.assign(data, {
        template: template,
        markers: markers
      });

      while (renderWalker.nextNode()) {
        var node = renderWalker.currentNode;

        if (node.nodeType === Node.TEXT_NODE) {
          /* istanbul ignore next */
          if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
            node.textContent = '';
          } else if (IS_IE) {
            node.textContent = node.textContent.replace(ATTR_REGEXP, '');
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.indexOf('-') > -1 && !customElements.get(node.tagName.toLowerCase())) {
            throw Error("Missing '".concat(stringifyElement(node), "' element definition in '").concat(stringifyElement(host), "'"));
          }
        }

        while (currentPart && currentPart[0] === renderIndex) {
          markers.push([node, currentPart[1]]);
          currentPart = clonedParts.shift();
        }

        renderIndex += 1;
      }

      var childList = Array.from(fragment.childNodes);
      data.startNode = childList[0];
      data.endNode = childList[childList.length - 1];

      if (target.nodeType === Node.TEXT_NODE) {
        var previousChild = target;
        childList.forEach(function (child) {
          target.parentNode.insertBefore(child, previousChild.nextSibling);
          previousChild = child;
        });
      } else {
        target.appendChild(fragment);
      }
    }

    data.markers.forEach(function (_ref, index) {
      var _ref2 = _slicedToArray(_ref, 2),
          node = _ref2[0],
          fn = _ref2[1];

      if (data.lastArgs && data.lastArgs[index] === args[index]) return;
      fn(host, node, args[index], data.lastArgs ? data.lastArgs[index] : undefined);
    });
    data.lastArgs = args;
  };
}

var promiseMap = new WeakMap();
function resolve(promise, placeholder) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  return function (host, target) {
    var timeout;

    if (placeholder) {
      timeout = setTimeout(function () {
        timeout = undefined;
        requestAnimationFrame(function () {
          placeholder(host, target);
        });
      }, delay);
    }

    promiseMap.set(target, promise);
    promise.then(function (template) {
      if (timeout) clearTimeout(timeout);

      if (promiseMap.get(target) === promise) {
        template(host, target);
        promiseMap.set(target, null);
      }
    });
  };
}

var PLACEHOLDER = getPlaceholder();
var templatesMap = new Map();
var stylesMap = new WeakMap();
var helpers = {
  define: function define$1(elements) {
    define(elements);
    return this;
  },
  key: function key(id) {
    this.id = id;
    return this;
  },
  style: function style() {
    for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
      styles[_key] = arguments[_key];
    }

    stylesMap.set(this, styles);
    return this;
  }
};

function create(parts, args, isSVG) {
  var fn = function fn(host) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : host;
    var styles = stylesMap.get(fn);
    var id = "".concat(parts.join(PLACEHOLDER)).concat(styles ? styles.join(PLACEHOLDER) : '').concat(isSVG ? 'svg' : '');
    var render = templatesMap.get(id);

    if (!render) {
      render = compile$1(parts, isSVG, styles);
      templatesMap.set(id, render);
    }

    render(host, target, args);
  };

  return Object.assign(fn, helpers);
}

function html(parts) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return create(parts, args);
}
function svg(parts) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return create(parts, args, true);
}
Object.assign(html, {
  resolve: resolve
});
Object.assign(svg, {
  resolve: resolve
});

export { children, define, dispatch, html, parent, property, render, svg };
//# sourceMappingURL=hybrids.js.map
