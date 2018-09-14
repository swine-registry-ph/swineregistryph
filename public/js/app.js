webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(56)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20);
module.exports = __webpack_require__(134);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(44);

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

__webpack_require__(21);

window.Vue = __webpack_require__(7);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Import store file for vuex


// App
Vue.component('app-input-date', __webpack_require__(47));
Vue.component('app-input-select', __webpack_require__(50));

// Admin
Vue.component('manage-breeds', __webpack_require__(53));
Vue.component('manage-breeders', __webpack_require__(59));
Vue.component('manage-evaluators', __webpack_require__(69));
Vue.component('manage-properties', __webpack_require__(74));
Vue.component('manage-apis', __webpack_require__(79));

// Breeder
Vue.component('register-swine', __webpack_require__(84));
Vue.component('view-registered-swine', __webpack_require__(119));

// Genomics
Vue.component('register-laboratory-results', __webpack_require__(124));
Vue.component('view-laboratory-results', __webpack_require__(129));

// For main container
var app = new Vue({
    el: '#app',
    store: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */]
});

// For header container
var nav = new Vue({
    el: '#custom-nav',

    data: {
        currentRoute: {
            admin: {
                adminViewRegdSwine: false,
                showManageBreeders: false,
                showManageEvaluators: false,
                showManagePropertiesView: false,
                showManageBreedsView: false,
                manageAPIsView: false,
                reports: false
            },
            breeder: {
                showRegForm: false,
                viewRegdSwine: false,
                viewSwinePedigree: false,
                manageFarms: false,
                reports: false
            },
            genomics: {
                regLabResults: false,
                viewLabResults: false
            }
        }
    },

    mounted: function mounted() {
        // const mainElement = document.querySelector('.main-logged-in');
        // const footerElement = document.querySelector('.footer-logged-in');

        // Initialize side navigation
        $(".button-collapse").sideNav({
            onOpen: function onOpen() {
                // Add 300px padding on left of containers upon 
                // opening of side navigation
                // if(!window.matchMedia("(max-width: 992px)").matches){
                //     mainElement.style.cssText = "padding-left: 300px;";
                //     footerElement.style.cssText = "padding-left: 300px;";
                // }
            },

            onClose: function onClose() {
                // Remove padding on left of containers upon 
                // closing of side navigation
                // if(!window.matchMedia("(max-width: 992px)").matches){
                //     mainElement.style.cssText = "padding-left: 0px;";
                //     footerElement.style.cssText = "padding-left: 0px;";
                // }
            }
        });

        // Initialize side navigation active link
        switch (location.pathname) {
            case '/admin/view-registered-swine':
                this.currentRoute.admin.adminViewRegdSwine = true;
                break;

            case '/admin/manage/apis':
                this.currentRoute.admin.manageAPIsView = true;
                break;

            case '/admin/manage/properties':
                this.currentRoute.admin.showManagePropertiesView = true;
                break;

            case '/admin/manage/breeds':
                this.currentRoute.admin.showManageBreedsView = true;
                break;

            case '/admin/manage/breeders':
                this.currentRoute.admin.showManageBreeders = true;
                break;

            case '/admin/manage/evaluators':
                this.currentRoute.admin.showManageEvaluators = true;
                break;

            case '/breeder/manage-swine/register':
                this.currentRoute.breeder.showRegForm = true;
                break;

            case '/breeder/manage-swine/view':
                this.currentRoute.breeder.viewRegdSwine = true;
                break;

            case '/breeder/pedigree':
                this.currentRoute.breeder.viewSwinePedigree = true;
                break;

            case '/genomics/register':
                this.currentRoute.genomics.regLabResults = true;
                break;

            case '/genomics/manage/laboratory-results':
                this.currentRoute.genomics.viewLabResults = true;
                break;

            default:
                break;

        }
    }
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

window._ = __webpack_require__(8);

/**
 * We'll load jQuery and the MaterializeCSS jQuery plugin which provides support
 * for JavaScript based MaterializeCSS features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
  window.$ = window.jQuery = __webpack_require__(4);

  __webpack_require__(10);
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(11);

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });

/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_registerSwine__ = __webpack_require__(46);




__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */].Store({
    modules: {
        registerSwine: __WEBPACK_IMPORTED_MODULE_2__modules_registerSwine__["a" /* default */]
    }
}));

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Store */
/* unused harmony export install */
/* unused harmony export mapState */
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/* unused harmony export createNamespacedHelpers */
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    "development" !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ("development" !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ("development" !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ("development" !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ("development" !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["a"] = (index_esm);


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Initial state
var state = {
    gpOne: {
        id: 0,
        regNo: '',
        breedId: '',
        sex: '',
        birthDate: '',
        farmFromId: '',
        geneticInfoId: '',
        farmSwineId: '',
        houseType: '',
        teatNo: '',
        adgBirthEndDate: '',
        adgBirthEndWeight: '',
        adgTestStartDate: '',
        adgTestEndDate: '',
        adgTestStartWeight: '',
        adgTestEndWeight: '',
        bft: '',
        bftCollected: '',
        feedIntake: '',
        birthWeight: '',
        littersizeAliveMale: '',
        littersizeAliveFemale: '',
        parity: '',
        littersizeWeaning: '',
        litterweightWeaning: '',
        dateWeaning: '',
        swinecart: false
    },
    gpSire: {
        existingRegNo: '',
        imported: {
            regNo: '',
            farmOfOrigin: '',
            countryOfOrigin: ''
        },
        sex: 'male',
        geneticInfoId: '',
        farmSwineId: '',
        farmFromId: '',
        birthDate: '',
        houseType: '',
        teatNo: '',
        adgBirthEndDate: '',
        adgBirthEndWeight: '',
        adgTestStartDate: '',
        adgTestEndDate: '',
        adgTestStartWeight: '',
        adgTestEndWeight: '',
        bft: '',
        bftCollected: '',
        feedIntake: '',
        birthWeight: '',
        littersizeAliveMale: '',
        littersizeAliveFemale: '',
        parity: '',
        littersizeWeaning: '',
        litterweightWeaning: '',
        dateWeaning: ''
    },
    gpDam: {
        existingRegNo: '',
        imported: {
            regNo: '',
            farmOfOrigin: '',
            countryOfOrigin: ''
        },
        sex: 'female',
        geneticInfoId: '',
        farmSwineId: '',
        farmFromId: '',
        birthDate: '',
        houseType: '',
        teatNo: '',
        adgBirthEndDate: '',
        adgBirthEndWeight: '',
        adgTestStartDate: '',
        adgTestEndDate: '',
        adgTestStartWeight: '',
        adgTestEndWeight: '',
        bft: '',
        bftCollected: '',
        feedIntake: '',
        birthWeight: '',
        littersizeAliveMale: '',
        littersizeAliveFemale: '',
        parity: '',
        littersizeWeaning: '',
        litterweightWeaning: '',
        dateWeaning: ''
    },
    imageFiles: {
        side: {},
        front: {},
        back: {},
        top: {}
    }
};

// getters
var getters = {
    gpOneData: function gpOneData(state) {
        return state.gpOne;
    },

    gpSireData: function gpSireData(state) {
        return state.gpSire;
    },

    gpDamData: function gpDamData(state) {
        return state.gpDam;
    },

    imageFiles: function imageFiles(state) {
        return state.imageFiles;
    },

    computedAdgFromBirth: function computedAdgFromBirth(state, getters) {
        return function (instance) {
            // ADG from birth is computed as (endWeight - birthWeight) / 180
            // adjusted 180-day weight
            var endDateInDays = getters.msToDays(state[instance].adgBirthEndDate);
            var birthDateInDays = getters.msToDays(state[instance].birthDate);
            var days = endDateInDays - birthDateInDays;
            var adjWeightAt180 = getters.adjustedWeight(state[instance].adgBirthEndWeight, days, 180);
            var dividend = adjWeightAt180 - parseInt(state[instance].birthWeight);

            return dividend > 0 ? getters.customRound(dividend / 180, 2) : 0;
        };
    },

    computedAdgOnTest: function computedAdgOnTest(state, getters) {
        return function (instance) {
            // ADG on test is computed as (endWeight - startWeight) / 60
            // adjusted 150-day weight to 90-day weight
            var endDateInDays = getters.msToDays(state[instance].adgTestEndDate);
            var startDateInDays = getters.msToDays(state[instance].adgTestStartDate);
            var birthDateInDays = getters.msToDays(state[instance].birthDate);
            var endToBirthDays = endDateInDays - birthDateInDays;
            var startToBirthDays = startDateInDays - birthDateInDays;
            var adjWeightAt150 = getters.adjustedWeight(state[instance].adgTestEndWeight, endToBirthDays, 150);
            var adjWeightAt90 = getters.adjustedWeight(state[instance].adgTestStartWeight, startToBirthDays, 90);
            var dividend = adjWeightAt150 - adjWeightAt90;

            return dividend > 0 ? getters.customRound(dividend / 60, 2) : 0;
        };
    },

    computedFeedEfficiency: function computedFeedEfficiency(state, getters) {
        return function (instance) {
            // Feed efficiency is computed as feedIntake / adgOnTest
            var feedIntake = state[instance].feedIntake;
            var adgOnTest = getters.computedAdgOnTest(instance);

            return adgOnTest > 0 ? getters.customRound(feedIntake / adgOnTest, 2) : 0;
        };
    },

    adjustedWeight: function adjustedWeight(state, getters) {
        return function (weight, days, toDays) {
            // Compute adjusted weight according to 'toDays' variable
            // Ex. the adjusted 180-day weight should have the
            // equation (weight * 180) / days
            return days === toDays ? parseInt(weight) : parseInt(weight) * toDays / days;
        };
    },

    msToDays: function msToDays(state) {
        return function (date) {
            // Convert date to milliseconds then
            // convert milliseconds to days
            return new Date(date).valueOf() / 1000 / 86400;
        };
    },

    customRound: function customRound(state) {
        return function (number) {
            var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

            // Rounds number to 'precision' number of places
            // Default number of places is 2
            var factor = Math.pow(10, precision);

            return !isNaN(Math.round(number * factor) / factor) ? Math.round(number * factor) / factor : 0;
        };
    }

    // mutations
};var mutations = {
    updateValue: function updateValue(state, payload) {
        // Check if property includes period for access
        // to nested object property such as
        // gpSire.imported.regNo
        if (payload.property.includes('.')) {
            var nestedProperty = payload.property.split('.');
            state[payload.instance][nestedProperty[0]][nestedProperty[1]] = payload.value;
        } else state[payload.instance][payload.property] = payload.value;
    },
    updateParent: function updateParent(state, _ref) {
        var instance = _ref.instance,
            sex = _ref.sex,
            data = _ref.data;

        if (data) {
            // Replace entire object given that the new
            // object has the same properties
            // as the old one
            state[instance] = data;
        } else {
            // Or make values of object set to default
            var defaultObject = Object.keys(state[instance]).map(function (key) {
                if (key === 'sex') {
                    state[instance][key] = sex;
                } else if (key === 'imported') {
                    Object.keys(state[instance]['imported']).map(function (importedKey) {
                        state[instance]['imported'][importedKey] = '';
                    });
                } else {
                    state[instance][key] = '';
                }
            });
        }
    },
    addToImageFiles: function addToImageFiles(state, _ref2) {
        var imageDetails = _ref2.imageDetails,
            orientation = _ref2.orientation;

        // Add image according to its orientation
        state.imageFiles[orientation] = imageDetails;
    },
    removeFromImageFiles: function removeFromImageFiles(state, _ref3) {
        var orientation = _ref3.orientation;

        // Remove image according to its orientation
        state.imageFiles[orientation] = {};
    }
};

// actions
var actions = {};

/* harmony default export */ __webpack_exports__["a"] = ({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(48),
  /* template */
  __webpack_require__(49),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/AppInputDate.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] AppInputDate.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-384ebdd0", Component.options)
  } else {
    hotAPI.reload("data-v-384ebdd0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        value: String
    },

    mounted: function mounted() {
        var _this = this;

        // Initialize datepicker
        $(this.$refs.dateSelect).pickadate({
            max: true,
            selectMonths: true,
            selectYears: 3,
            format: 'mmmm d, yyyy'
        });

        $(this.$refs.dateSelect).on('change', function () {
            _this.$emit('date-select', _this.$refs.dateSelect.value);
        });
    }
});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('input', {
    ref: "dateSelect",
    staticClass: "datepicker",
    attrs: {
      "type": "date",
      "name": "date"
    },
    domProps: {
      "value": _vm.value
    }
  })
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-384ebdd0", module.exports)
  }
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(51),
  /* template */
  __webpack_require__(52),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/AppInputSelect.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] AppInputSelect.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1c21319e", Component.options)
  } else {
    hotAPI.reload("data-v-1c21319e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        labelDescription: String,
        value: String,
        options: Array
    },

    data: function data() {
        return {
            hideLabel: false
        };
    },
    mounted: function mounted() {
        var _this = this;

        // Initialize Material select
        $(this.$refs.select).material_select();

        // Temporary way to make initial value
        // on select have gray text color
        $(this.$refs.select).parents('.select-wrapper').find('input.select-dropdown').addClass('grey-text');

        $(this.$refs.select).on('change', function () {
            _this.$emit('select', _this.$refs.select.value);

            // Show label upon value change
            _this.hideLabel = true;

            // Make value on select have
            // black text color
            $(_this.$refs.select).parents('.select-wrapper').find('input.select-dropdown').removeClass('grey-text');
        });
    }
});

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "app-input-select"
  }, [_c('select', {
    ref: "select",
    domProps: {
      "value": _vm.value
    }
  }, [_c('option', {
    attrs: {
      "value": "",
      "disabled": ""
    }
  }, [_vm._v(" Choose " + _vm._s(_vm.labelDescription) + " ")]), _vm._v(" "), _vm._l((_vm.options), function(option) {
    return _c('option', {
      domProps: {
        "value": option.value
      }
    }, [_vm._v(" " + _vm._s(option.text) + " ")])
  })], 2), _vm._v(" "), _c('label', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.hideLabel),
      expression: "hideLabel"
    }],
    attrs: {
      "for": ""
    }
  }, [_vm._v(" " + _vm._s(_vm.labelDescription) + " ")])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1c21319e", module.exports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(54)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(57),
  /* template */
  __webpack_require__(58),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-63d665c6",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ManageBreeds.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ManageBreeds.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-63d665c6", Component.options)
  } else {
    hotAPI.reload("data-v-63d665c6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("84fa81c4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63d665c6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageBreeds.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-63d665c6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageBreeds.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.collection-header a[data-v-63d665c6], .edit-breed-button[data-v-63d665c6], #close-add-breed-container-button[data-v-63d665c6] {\n    cursor: pointer;\n}\n.collection-item[data-v-63d665c6] {\n    overflow: auto;\n}\n.collection-item .row[data-v-63d665c6] {\n    margin-bottom: 0;\n}\n#add-breed-container[data-v-63d665c6] {\n    padding-bottom: 2rem;\n}\n#edit-breed-modal[data-v-63d665c6] {\n    width: 30rem;\n    height: 30rem;\n}\n.custom-secondary-btn[data-v-63d665c6] {\n    border: 1px solid;\n    background-color: white;\n}\n\n/* Modal customizations */\ndiv.modal-input-container[data-v-63d665c6] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n.modal.modal-fixed-footer .modal-footer[data-v-63d665c6] {\n    border: 0;\n}\n.modal .modal-footer[data-v-63d665c6] {\n    padding-right: 2rem;\n}\n\n", ""]);

// exports


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        initialBreeds: Array
    },

    data: function data() {
        return {
            breeds: this.initialBreeds,
            showAddBreedInput: false,
            addBreedData: {
                title: '',
                code: ''
            },
            editBreedData: {
                index: -1,
                id: 0,
                title: '',
                code: ''
            }
        };
    },


    methods: {
        toggleAddBreedContainer: function toggleAddBreedContainer() {
            this.showAddBreedInput = !this.showAddBreedInput;
        },
        addBreed: function addBreed(event) {
            var _this = this;

            var vm = this;
            var addBreedButton = $('.add-breed-button');

            this.disableButtons(addBreedButton, event.target, 'Adding...');

            // Add to server's database
            axios.post('/admin/manage/breeds', {
                title: vm.addBreedData.title,
                code: vm.addBreedData.code
            }).then(function (response) {
                // Put response in local data storage and erase adding of breed data
                vm.breeds.push(response.data);
                vm.addBreedData.title = '';
                vm.addBreedData.code = '';

                // Update UI after adding breed
                vm.$nextTick(function () {
                    $('#breed-title').removeClass('valid');
                    $('#breed-code').removeClass('valid');

                    _this.enableButtons(addBreedButton, event.target, 'Add Breed');

                    Materialize.updateTextFields();
                    Materialize.toast('Breed added', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        toggleEditBreedModal: function toggleEditBreedModal(index) {
            // Initialize data for editing
            this.editBreedData.index = index;
            this.editBreedData.id = this.breeds[index].id;
            this.editBreedData.title = this.breeds[index].title;
            this.editBreedData.code = this.breeds[index].code;

            $('#edit-breed-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },
        updateBreed: function updateBreed(event) {
            var _this2 = this;

            var vm = this;
            var index = this.editBreedData.index;
            var updateBreedButton = $('.update-breed-btn');

            this.disableButtons(updateBreedButton, event.target, 'Updating...');

            // Update to server's database
            axios.patch('/admin/manage/breeds', {
                breedId: vm.editBreedData.id,
                title: vm.editBreedData.title,
                code: vm.editBreedData.code
            }).then(function (response) {
                // Update local data storage and erase editing of breed data
                if (response.data === 'OK') {
                    vm.breeds[index].title = vm.editBreedData.title;
                    vm.breeds[index].code = vm.editBreedData.code;
                    vm.editBreedData = {
                        index: -1,
                        id: 0,
                        title: '',
                        code: ''
                    };
                }

                // Update UI after updating breed
                vm.$nextTick(function () {
                    $('#edit-breed-modal').modal('close');
                    $('#edit-breed-title').removeClass('valid');
                    $('#edit-breed-code').removeClass('valid');

                    _this2.enableButtons(updateBreedButton, event.target, 'Update');

                    Materialize.updateTextFields();
                    Materialize.toast('Breed updated', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('ul', {
    staticClass: "collection with-header"
  }, [_c('li', {
    staticClass: "collection-header"
  }, [_c('a', {
    staticClass: "btn-floating waves-effect waves-light tooltipped",
    attrs: {
      "href": "#!",
      "id": "toggle-add-breed-container-button",
      "data-position": "right",
      "data-delay": "50",
      "data-tooltip": "Add new breed"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.toggleAddBreedContainer()
      }
    }
  }, [_c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("add")])])]), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showAddBreedInput),
      expression: "showAddBreedInput"
    }],
    staticClass: "collection-item",
    attrs: {
      "id": "add-breed-container"
    }
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('i', {
    staticClass: "material-icons right",
    attrs: {
      "id": "close-add-breed-container-button"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.toggleAddBreedContainer()
      }
    }
  }, [_vm._v("\n                            close\n                        ")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addBreedData.title),
      expression: "addBreedData.title"
    }],
    staticClass: "validate",
    attrs: {
      "id": "breed-title",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addBreedData.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addBreedData, "title", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "breed-title"
    }
  }, [_vm._v("Breed Title")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addBreedData.code),
      expression: "addBreedData.code"
    }],
    staticClass: "validate",
    attrs: {
      "id": "breed-code",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addBreedData.code)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addBreedData, "code", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "breed-code"
    }
  }, [_vm._v("Breed Code")])]), _vm._v(" "), _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('a', {
    staticClass: "right btn z-depth-0 add-breed-button",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addBreed($event)
      }
    }
  }, [_vm._v("\n                            Add Breed\n                        ")])])])]), _vm._v(" "), _vm._l((_vm.breeds), function(breed, index) {
    return _c('li', {
      key: breed.id,
      staticClass: "collection-item"
    }, [_c('b', [_vm._v(_vm._s(breed.title))]), _vm._v(" (" + _vm._s(breed.code) + ")\n                "), _c('span', [_c('a', {
      staticClass: "secondary-content \n                            btn custom-secondary-btn \n                            edit-breed-button \n                            blue-text \n                            text-darken-1\n                            z-depth-0",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleEditBreedModal(index)
        }
      }
    }, [_vm._v("\n                        Edit\n                    ")])])])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "edit-breed-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editBreedData.title),
      expression: "editBreedData.title"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-breed-title",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editBreedData.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editBreedData, "title", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-breed-title"
    }
  }, [_vm._v("Breed Title")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editBreedData.code),
      expression: "editBreedData.code"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-breed-code",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editBreedData.code)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editBreedData, "code", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-breed-code"
    }
  }, [_vm._v("Breed Code")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect btn-flat ",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action waves-effect btn blue darken-1 z-depth-0 update-breed-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.updateBreed($event)
      }
    }
  }, [_vm._v("\n                Update\n            ")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" Manage Breeds ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Edit Breed\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-63d665c6", module.exports)
  }
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(60)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(62),
  /* template */
  __webpack_require__(68),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-2b3e0810",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ManageBreeders.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ManageBreeders.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b3e0810", Component.options)
  } else {
    hotAPI.reload("data-v-2b3e0810", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("5af96e1a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b3e0810\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageBreeders.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b3e0810\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageBreeders.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\nh4 i[data-v-2b3e0810] {\n    cursor: pointer;\n}\n.card .card-action[data-v-2b3e0810] {\n    border: 0;\n}\n#toggle-register-breeder-btn-container[data-v-2b3e0810] {\n    padding: 2rem 0 1rem 0;\n}\n#toggle-register-breeder-btn[data-v-2b3e0810] {\n    border-radius: 20px;\n}\n.pagination-container[data-v-2b3e0810] {\n    padding-top: 2rem;\n    padding-bottom: 2rem;\n}\n\n/* Modal customizations */\n#add-breeder-modal[data-v-2b3e0810], #edit-breeder-modal[data-v-2b3e0810] {\n    width: 40rem;\n}\n.modal .modal-footer[data-v-2b3e0810] {\n    padding-right: 2rem;\n}\ndiv.modal-input-container[data-v-2b3e0810] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n\n/* \n* Card highlights for chosen breeder \n* upon managing of farms\n*/\n.card-chosen-breeder[data-v-2b3e0810] {\n    border-top: 8px solid #26a65a;\n}\n.name-chosen-breeder[data-v-2b3e0810] {\n    color: #26a65a;\n}\n\n", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ManageBreedersManageFarm_vue__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ManageBreedersManageFarm_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ManageBreedersManageFarm_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        initialBreeders: Array,
        provinceOptions: Array
    },

    components: {
        ManageFarms: __WEBPACK_IMPORTED_MODULE_0__ManageBreedersManageFarm_vue___default.a
    },

    data: function data() {
        return {
            pageNumber: 0,
            paginationSize: 6,
            breeders: this.initialBreeders,
            addBreederData: {
                name: '',
                email: ''
            },
            editBreederData: {
                index: 0,
                userId: 0,
                name: '',
                email: ''
            },
            manageFarmsData: {
                containerIndex: 0,
                paginatedBreederIndex: -1,
                breederIndex: -1,
                breederId: 0,
                name: '',
                farms: []
            }
        };
    },


    computed: {
        pageCount: function pageCount() {
            var l = this.breeders.length;
            var s = this.paginationSize;

            return Math.ceil(l / s);
        },
        paginatedBreeders: function paginatedBreeders() {
            var start = this.pageNumber * this.paginationSize;
            var end = start + this.paginationSize;

            return _.sortBy(this.breeders, ['name']).slice(start, end);
        }
    },

    methods: {
        previousPage: function previousPage() {
            // For pagination
            // Check if Manage Farms container is closed
            this.closeManageFarmsContainer({ 'containerIndex': this.manageFarmsData.containerIndex });

            if (this.pageNumber !== 0) this.pageNumber--;
        },
        nextPage: function nextPage() {
            // For pagination
            // Check if Manage Farms container is closed
            this.closeManageFarmsContainer({ 'containerIndex': this.manageFarmsData.containerIndex });

            if (this.pageNumber < this.pageCount - 1) this.pageNumber++;
        },
        goToPage: function goToPage(page) {
            // For pagination
            // Check if Manage Farms container is closed
            this.closeManageFarmsContainer({ 'containerIndex': this.manageFarmsData.containerIndex });

            this.pageNumber = page - 1;
        },
        showAddBreederModal: function showAddBreederModal() {
            $('#add-breeder-modal').modal('open');
        },
        registerBreeder: function registerBreeder(event) {
            var _this = this;

            var vm = this;
            var registerBreederButton = $('.register-breeder-btn');

            this.disableButtons(registerBreederButton, event.target, 'Registering...');

            // Add to server's database
            axios.post('/admin/manage/breeders', {
                name: vm.addBreederData.name,
                email: vm.addBreederData.email
            }).then(function (response) {
                // Put response in local data storage and erase adding of breeder data
                vm.breeders.push(response.data);
                vm.addBreederData = {
                    name: '',
                    email: ''
                };

                // Update UI after adding breeder
                vm.$nextTick(function () {
                    $('#add-breeder-modal').modal('close');
                    $('#add-breeder-name').removeClass('valid');
                    $('#add-breeder-email').removeClass('valid');

                    _this.enableButtons(registerBreederButton, event.target, 'Register');

                    Materialize.updateTextFields();
                    Materialize.toast(response.data.name + ' added', 2500, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        showEditBreederModal: function showEditBreederModal(breederId) {
            // Initialize data for editing
            var index = this.findBreederIndexById(breederId);
            var breeder = this.breeders[index];

            this.editBreederData.index = index;
            this.editBreederData.userId = breeder.userId;
            this.editBreederData.name = breeder.name;
            this.editBreederData.email = breeder.email;

            $('#edit-breeder-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },
        updateBreeder: function updateBreeder(event) {
            var _this2 = this;

            var vm = this;
            var updateBreederButton = $('.update-breeder-btn');

            this.disableButtons(updateBreederButton, event.target, 'Updating...');

            // Update to server's database
            axios.patch('/admin/manage/breeders', {
                userId: vm.editBreederData.userId,
                name: vm.editBreederData.name,
                email: vm.editBreederData.email
            }).then(function (response) {
                // Put response in local data storage and erase editing of breeder data
                if (response.data.updated) {
                    var index = vm.editBreederData.index;

                    vm.breeders[index].name = vm.editBreederData.name;
                    vm.breeders[index].email = vm.editBreederData.email;
                    vm.editBreederData = {
                        index: 0,
                        userId: 0,
                        name: '',
                        email: ''
                    };

                    // Update UI after updating breeder
                    vm.$nextTick(function () {
                        $('#edit-breeder-modal').modal('close');
                        $('#edit-breeder-name').removeClass('valid');
                        $('#edit-breeder-email').removeClass('valid');

                        _this2.enableButtons(updateBreederButton, event.target, 'Update');

                        Materialize.updateTextFields();
                        Materialize.toast(vm.breeders[index].name + ' updated', 2500, 'green lighten-1');
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        showFarms: function showFarms(paginatedBreederIndex) {
            // Initialize needed variables and conditions and compute for
            // proper index placement of Manage Farms "container".
            // Note that indices here are related to the 
            // this.paginatedBreeders array and 
            // not the this.breeders array
            var currentContainerIndex = this.manageFarmsData.containerIndex;
            var manageFarmsContainerIsOpen = currentContainerIndex > 0;

            var increment = void 0,
                newContainerIndex = void 0,
                breederIndexIsGreaterThanBreedersLength = void 0;

            // Check if Manage Farms "container" is open
            if (manageFarmsContainerIsOpen) {
                var breederIndexIsGreaterThanContainerIndex = paginatedBreederIndex > currentContainerIndex;

                // Check if the computed index placement is greater than the "container" index
                if (breederIndexIsGreaterThanContainerIndex) {
                    var newBreederIndex = paginatedBreederIndex - 1;
                    increment = newBreederIndex === 0 || newBreederIndex % 2 === 0 ? 2 : 1;
                    breederIndexIsGreaterThanBreedersLength = newBreederIndex + increment > this.paginatedBreeders.length - 2;
                    newContainerIndex = breederIndexIsGreaterThanBreedersLength ? this.paginatedBreeders.length - 1 : newBreederIndex + increment;

                    // Remove first prior Manage Farms "container" from breeders array
                    this.paginatedBreeders.splice(currentContainerIndex, 1);
                    this.initializeManageFarmsData(newBreederIndex, newContainerIndex);
                    this.insertManageFarmsContainer(newBreederIndex, newContainerIndex);
                } else {
                    increment = paginatedBreederIndex === 0 || paginatedBreederIndex % 2 === 0 ? 2 : 1;
                    newContainerIndex = paginatedBreederIndex + increment;

                    // If Current Manage Farms "container" is the same with the new one
                    if (currentContainerIndex === newContainerIndex) {
                        this.initializeManageFarmsData(paginatedBreederIndex, currentContainerIndex);
                    } else {
                        // Remove current Manage Farms "container" first then 
                        // initialize the new one
                        this.paginatedBreeders.splice(currentContainerIndex, 1);
                        this.initializeManageFarmsData(paginatedBreederIndex, newContainerIndex);
                        this.insertManageFarmsContainer(paginatedBreederIndex, newContainerIndex);
                    }
                }
            } else {
                increment = paginatedBreederIndex === 0 || paginatedBreederIndex % 2 === 0 ? 2 : 1;
                breederIndexIsGreaterThanBreedersLength = paginatedBreederIndex + increment > this.paginatedBreeders.length - 1;
                newContainerIndex = breederIndexIsGreaterThanBreedersLength ? this.paginatedBreeders.length : paginatedBreederIndex + increment;

                this.initializeManageFarmsData(paginatedBreederIndex, newContainerIndex);
                this.insertManageFarmsContainer(paginatedBreederIndex, newContainerIndex);
            }
        },
        addBreederFarm: function addBreederFarm(data) {
            // Insert new breeder farm data to breeders array
            this.breeders[data.breederIndex].farms.push(data.farm);
        },
        updateBreederFarm: function updateBreederFarm(data) {
            // Edit breeder farm
            var farm = this.breeders[data.breederIndex].farms[data.farmIndex];

            farm.name = data.farm.name;
            farm.farm_code = data.farm.farmCode;
            farm.farm_accreditation_date = data.farm.accreditationDate;
            farm.farm_accreditation_no = data.farm.accreditationNo;
            farm.address_line1 = data.farm.addressLine1;
            farm.address_line2 = data.farm.addressLine2;
            farm.province = data.farm.province;
            farm.province_code = data.farm.provinceCode;
        },
        renewBreederFarm: function renewBreederFarm(data) {
            // Renew breeder farm
            var farm = this.breeders[data.breederIndex].farms[data.farmIndex];

            farm.is_suspended = 0;
            farm.farm_accreditation_date = data.newAccreditationDate;
        },
        initializeManageFarmsData: function initializeManageFarmsData(paginatedBreederIndex, containerIndex) {
            // Initialize data and metadata of Manage Farms "container"
            // Data should be mapped to the this.breeders array
            var breederId = this.paginatedBreeders[paginatedBreederIndex].breederId;
            var breederIndex = this.findBreederIndexById(breederId);

            this.manageFarmsData.containerIndex = containerIndex;
            this.manageFarmsData.paginatedBreederIndex = paginatedBreederIndex;
            this.manageFarmsData.breederIndex = breederIndex;
            this.manageFarmsData.breederId = this.breeders[breederIndex].breederId;
            this.manageFarmsData.name = this.breeders[breederIndex].name;
            this.manageFarmsData.farms = this.breeders[breederIndex].farms;
        },
        insertManageFarmsContainer: function insertManageFarmsContainer(paginatedBreederIndex, containerIndex) {
            // Insert Manage Farms "container" to breeders array
            this.paginatedBreeders.splice(containerIndex, 0, {
                userId: -1,
                breederId: -1,
                name: this.paginatedBreeders[paginatedBreederIndex].name,
                email: '',
                farms: []
            });
        },
        findBreederIndexById: function findBreederIndexById(id) {
            for (var i = 0; i < this.breeders.length; i++) {
                if (this.breeders[i].breederId === id) return i;
            }

            return -1;
        },
        closeManageFarmsContainer: function closeManageFarmsContainer(data) {
            if (data.containerIndex !== 0) this.paginatedBreeders.splice(data.containerIndex, 1);

            // Set manageFarmsData to default
            this.manageFarmsData = {
                containerIndex: 0,
                paginatedBreederIndex: -1,
                breederIndex: -1,
                breederId: 0,
                name: '',
                farms: []
            };
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(64)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(66),
  /* template */
  __webpack_require__(67),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-6d46f7eb",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ManageBreedersManageFarm.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ManageBreedersManageFarm.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6d46f7eb", Component.options)
  } else {
    hotAPI.reload("data-v-6d46f7eb", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(65);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("27351926", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6d46f7eb\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageBreedersManageFarm.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6d46f7eb\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageBreedersManageFarm.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\nh5 i[data-v-6d46f7eb] {\n    cursor: pointer;\n}\nspan.farm-title[data-v-6d46f7eb] {\n    font-size: 18px;\n}\n#toggle-add-farm-btn[data-v-6d46f7eb] {\n    margin-top: 1rem;\n    margin-left: 72px;\n    border-radius: 20px;\n}\n.custom-secondary-btn[data-v-6d46f7eb] {\n    border: 1px solid;\n    background-color: white;\n}\np.address-line[data-v-6d46f7eb] {\n    padding-top: 10px;\n}\n\n/* Modal customizations */\n#add-farm-modal[data-v-6d46f7eb], #edit-farm-modal[data-v-6d46f7eb] {\n    width: 50rem;\n}\n#renew-farm-modal[data-v-6d46f7eb] {\n    width: 40rem;\n    height:40rem;\n}\n.modal.modal-fixed-footer .modal-footer[data-v-6d46f7eb] {\n    border: 0;\n}\n.modal .modal-footer[data-v-6d46f7eb] {\n    padding-right: 2rem;\n}\ndiv.modal-input-container[data-v-6d46f7eb] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n\n/* Override MaterializeCSS' collection styles */\nul.collection[data-v-6d46f7eb] {\n    border: 0;\n    margin-top: 1rem;\n}\nli.collection-item[data-v-6d46f7eb] {\n    border: 0;\n    padding-bottom: 2rem;\n    padding-left: 0px !important;\n    margin-right: 72px;\n    margin-left: 72px;\n}\n\n/* \n* Card highlights for chosen breeder \n* upon managing of farms\n*/\n#manage-farms-container.card[data-v-6d46f7eb] {\n    border-top: 8px solid #26a65a;\n}\n.name-chosen-breeder[data-v-6d46f7eb] {\n    color: #26a65a;\n}\n\n", ""]);

// exports


/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        manageFarmsData: Object,
        provinceOptions: Array
    },

    data: function data() {
        return {
            addFarmData: {
                breederId: 0,
                name: '',
                farmCode: '',
                accreditationDate: '',
                accreditationNo: '',
                addressLine1: '',
                addressLine2: '',
                province: '',
                provinceCode: ''
            },
            editFarmData: {
                farmId: 0,
                farmIndex: -1,
                name: '',
                farmCode: '',
                accreditationDate: '',
                accreditationNo: '',
                addressLine1: '',
                addressLine2: '',
                province: '',
                provinceCode: ''
            },
            renewFarmData: {
                farmId: 0,
                farmIndex: -1,
                name: '',
                newAccreditationDate: ''
            }
        };
    },


    methods: {
        convertToReadableDate: function convertToReadableDate(date) {
            var dateObject = new Date(date);
            var monthConversion = {
                '0': 'January',
                '1': 'February',
                '2': 'March',
                '3': 'April',
                '4': 'May',
                '5': 'June',
                '6': 'July',
                '7': 'August',
                '8': 'September',
                '9': 'October',
                '10': 'November',
                '11': 'December'
            };

            return monthConversion[dateObject.getMonth()] + ' ' + dateObject.getDate() + ', ' + dateObject.getFullYear();
        },
        toggleCloseFarmsDataContainerEvent: function toggleCloseFarmsDataContainerEvent() {
            // Trigger event to ManageBreeders component
            this.$emit('close-manage-farms-event', { 'containerIndex': this.manageFarmsData.containerIndex });
        },
        showAddFarmModal: function showAddFarmModal() {
            $('#add-farm-modal').modal('open');
        },
        addFarm: function addFarm(event) {
            var _this = this;

            var vm = this;
            var addFarmButton = $('.add-farm-btn');
            // Parse input-date-select to get province and province code
            var provinceWithItsCode = vm.addFarmData.province.split(';').map(function (x) {
                return x.trim();
            });

            this.disableButtons(addFarmButton, event.target, 'Adding...');

            // Add to server's database
            axios.post('/admin/manage/farms', {
                breederId: vm.manageFarmsData.breederId,
                name: vm.addFarmData.name,
                farmCode: vm.addFarmData.farmCode,
                accreditationDate: vm.addFarmData.accreditationDate,
                accreditationNo: vm.addFarmData.accreditationNo,
                addressLine1: vm.addFarmData.addressLine1,
                addressLine2: vm.addFarmData.addressLine2,
                province: provinceWithItsCode[0],
                provinceCode: provinceWithItsCode[1]
            }).then(function (response) {
                // Put response in local data storage by emitting an event 
                // to ManageBreeders component
                vm.$emit('add-breeder-farm-event', {
                    'breederIndex': vm.manageFarmsData.breederIndex,
                    'farm': response.data
                });

                // Erase adding of breeder farm data
                vm.addFarmData = {
                    breederId: vm.manageFarmsData.breederId,
                    name: '',
                    farmCode: '',
                    accreditationDate: '',
                    accreditationNo: '',
                    addressLine1: '',
                    addressLine2: '',
                    province: '',
                    provinceCode: ''
                };

                // Update UI after adding breeder
                vm.$nextTick(function () {
                    $('#add-farm-modal').modal('close');
                    $('#add-farm-name').removeClass('valid');
                    $('#add-farm-code').removeClass('valid');
                    $('#add-farm-accreditation-no').removeClass('valid');
                    $('#add-farm-address-one').removeClass('valid');
                    $('#add-farm-address-two').removeClass('valid');

                    _this.enableButtons(addFarmButton, event.target, 'Add');

                    Materialize.updateTextFields();
                    Materialize.toast(response.data.name + ' farm added', 3000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        showEditFarmModal: function showEditFarmModal(index) {
            // Initialize data for editing
            var farm = this.manageFarmsData.farms[index];
            this.editFarmData.farmId = farm.id;
            this.editFarmData.farmIndex = index;
            this.editFarmData.name = farm.name;
            this.editFarmData.farmCode = farm.farm_code;
            this.editFarmData.accreditationDate = this.convertToReadableDate(farm.farm_accreditation_date);
            this.editFarmData.accreditationNo = farm.farm_accreditation_no;
            this.editFarmData.addressLine1 = farm.address_line1;
            this.editFarmData.addressLine2 = farm.address_line2;
            this.editFarmData.province = farm.province + ' ; ' + farm.province_code;
            this.editFarmData.provinceCode = farm.province_code;

            $('#edit-farm-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
                $('#edit-farm-modal select').material_select();
            });
        },
        updateFarm: function updateFarm(event) {
            var _this2 = this;

            var vm = this;
            var updateFarmButton = $('.update-farm-btn');
            // Parse input-date-select to get province and province code
            var provinceWithItsCode = vm.editFarmData.province.split(';').map(function (x) {
                return x.trim();
            });

            this.disableButtons(updateFarmButton, event.target, 'Updating...');

            // Update to server's database
            axios.patch('/admin/manage/farms', {
                farmId: vm.editFarmData.farmId,
                name: vm.editFarmData.name,
                farmCode: vm.editFarmData.farmCode,
                accreditationDate: vm.editFarmData.accreditationDate,
                accreditationNo: vm.editFarmData.accreditationNo,
                addressLine1: vm.editFarmData.addressLine1,
                addressLine2: vm.editFarmData.addressLine2,
                province: provinceWithItsCode[0],
                provinceCode: provinceWithItsCode[1]
            }).then(function (response) {
                // Edit farm in local data storage by emitting an event 
                // to ManageBreeders component
                vm.editFarmData.province = provinceWithItsCode[0];
                vm.editFarmData.provinceCode = provinceWithItsCode[1];
                vm.$emit('update-breeder-farm-event', {
                    'breederIndex': vm.manageFarmsData.breederIndex,
                    'farmIndex': vm.editFarmData.farmIndex,
                    'farm': vm.editFarmData
                });

                // Update UI after updating breeder farm
                vm.$nextTick(function () {
                    $('#edit-farm-modal').modal('close');
                    $('#edit-farm-name').removeClass('valid');
                    $('#edit-farm-code').removeClass('valid');
                    $('#edit-farm-accreditation-no').removeClass('valid');
                    $('#edit-farm-address-one').removeClass('valid');
                    $('#edit-farm-address-two').removeClass('valid');

                    _this2.enableButtons(updateFarmButton, event.target, 'Update');

                    Materialize.updateTextFields();
                    Materialize.toast(vm.editFarmData.name + ' farm updated', 3000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        showRenewFarmModal: function showRenewFarmModal(index) {
            // Initialize data for renewing
            var farm = this.manageFarmsData.farms[index];
            this.renewFarmData.farmId = farm.id;
            this.renewFarmData.farmIndex = index;
            this.renewFarmData.name = farm.name;

            $('#renew-farm-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },
        renewFarm: function renewFarm(event) {
            var _this3 = this;

            var vm = this;
            var renewFarmButton = $('.renew-farm-btn');

            this.disableButtons(renewFarmButton, event.target, 'Renewing...');

            // Update server's database
            axios.patch('/admin/manage/farms/renew', {
                farmId: vm.renewFarmData.farmId,
                newAccreditationDate: vm.renewFarmData.newAccreditationDate
            }).then(function (response) {
                // Edit farm in local data storage by emitting an event 
                // to ManageBreeders component
                vm.$emit('renew-breeder-farm-event', {
                    'breederIndex': vm.manageFarmsData.breederIndex,
                    'farmIndex': vm.renewFarmData.farmIndex,
                    'newAccreditationDate': vm.renewFarmData.newAccreditationDate
                });

                // Update UI after renewing breeder farm
                vm.$nextTick(function () {
                    $('#renew-farm-modal').modal('close');

                    _this3.enableButtons(renewFarmButton, event.target, 'Renew');

                    Materialize.updateTextFields();
                    Materialize.toast(vm.renewFarmData.name + ' farm renewed!', 3000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card",
    attrs: {
      "id": "manage-farms-container"
    }
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('h5', [_c('b', {
    staticClass: "name-chosen-breeder"
  }, [_vm._v(_vm._s(_vm.manageFarmsData.name))]), _vm._v(" "), _c('i', {
    staticClass: "material-icons right",
    on: {
      "click": function($event) {
        $event.preventDefault();
        return _vm.toggleCloseFarmsDataContainerEvent($event)
      }
    }
  }, [_vm._v("\n                close\n            ")])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('h5', {
    staticClass: "center-align"
  }, [_vm._v(" Manage Farms ")]), _vm._v(" "), _c('a', {
    staticClass: "btn z-depth-0",
    attrs: {
      "id": "toggle-add-farm-btn",
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        return _vm.showAddFarmModal($event)
      }
    }
  }, [_c('i', {
    staticClass: "material-icons left"
  }, [_vm._v("add")]), _vm._v(" Add Farm\n        ")]), _vm._v(" "), _c('ul', {
    staticClass: "collection"
  }, _vm._l((_vm.manageFarmsData.farms), function(farm, index) {
    return _c('li', {
      key: farm.id,
      staticClass: "collection-item avatar"
    }, [_c('span', {
      staticClass: "farm-title",
      class: {
        'grey-text text-darken-2': farm.is_suspended
      }
    }, [_c('b', [_vm._v(_vm._s(farm.name) + " (" + _vm._s(farm.farm_code) + ")")])]), _vm._v(" "), _c('p', {
      class: {
        'grey-text text-darken-2': farm.is_suspended
      }
    }, [(farm.is_suspended) ? [_c('b', {
      staticClass: "red-text text-lighten-1"
    }, [_vm._v(" SUSPENDED • ACCREDITATION EXPIRED ")]), _vm._v(" "), _c('br')] : _vm._e(), _vm._v("\n                    Accreditation No. : " + _vm._s(farm.farm_accreditation_no) + " "), _c('br'), _vm._v("\n                    Accreditation Date. : " + _vm._s(_vm.convertToReadableDate(farm.farm_accreditation_date)) + "  "), _c('br')], 2), _vm._v(" "), _c('p', {
      staticClass: "grey-text text-darken-2 address-line"
    }, [_c('i', {
      staticClass: "material-icons left"
    }, [_vm._v("location_on")]), _vm._v("\n                    " + _vm._s(farm.address_line1) + ", " + _vm._s(farm.address_line2) + ",\n                    " + _vm._s(farm.province) + " (" + _vm._s(farm.province_code) + ")\n                ")]), _vm._v(" "), (!farm.is_suspended) ? _c('a', {
      staticClass: "secondary-content btn z-depth-0 custom-secondary-btn blue-text text-darken-1",
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showEditFarmModal(index)
        }
      }
    }, [_vm._v(" \n                    Edit \n                ")]) : _c('a', {
      staticClass: "secondary-content btn z-depth-0 custom-secondary-btn orange-text text-darken-4",
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showRenewFarmModal(index)
        }
      }
    }, [_vm._v(" \n                    Renew \n                ")])])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "add-farm-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(0), _vm._v(" "), _c('h5', {
    staticClass: "grey-text text-darken-2"
  }, [_vm._v(" " + _vm._s(_vm.manageFarmsData.name) + " ")]), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s8"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addFarmData.name),
      expression: "addFarmData.name"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-farm-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addFarmData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addFarmData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-farm-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addFarmData.farmCode),
      expression: "addFarmData.farmCode"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-farm-code",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addFarmData.farmCode)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addFarmData, "farmCode", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-farm-code"
    }
  }, [_vm._v("Farm Code")])]), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "input-field col s8"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.addFarmData.accreditationDate = val
      }
    },
    model: {
      value: (_vm.addFarmData.accreditationDate),
      callback: function($$v) {
        _vm.$set(_vm.addFarmData, "accreditationDate", $$v)
      },
      expression: "addFarmData.accreditationDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Accreditation Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addFarmData.accreditationNo),
      expression: "addFarmData.accreditationNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-farm-accreditation-no",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addFarmData.accreditationNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addFarmData, "accreditationNo", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-farm-accreditation-no"
    }
  }, [_vm._v("Accreditation No.")])]), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addFarmData.addressLine1),
      expression: "addFarmData.addressLine1"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-farm-address-one",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addFarmData.addressLine1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addFarmData, "addressLine1", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-farm-address-one"
    }
  }, [_vm._v("Address Line 1")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addFarmData.addressLine2),
      expression: "addFarmData.addressLine2"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-farm-address-two",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addFarmData.addressLine2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addFarmData, "addressLine2", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-farm-address-two"
    }
  }, [_vm._v("Address Line 2")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Province",
      "options": _vm.provinceOptions
    },
    on: {
      "select": function (val) {
        _vm.addFarmData.province = val
      }
    },
    model: {
      value: (_vm.addFarmData.province),
      callback: function($$v) {
        _vm.$set(_vm.addFarmData, "province", $$v)
      },
      expression: "addFarmData.province"
    }
  })], 1)])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action btn z-depth-0 add-farm-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addFarm($event)
      }
    }
  }, [_vm._v("\n                Add\n            ")])])]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "edit-farm-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(4), _vm._v(" "), _c('h5', {
    staticClass: "grey-text text-darken-2"
  }, [_vm._v(" " + _vm._s(_vm.manageFarmsData.name) + " > " + _vm._s(_vm.editFarmData.name) + " ")]), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(5), _vm._v(" "), _c('div', {
    staticClass: "input-field col s8"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editFarmData.name),
      expression: "editFarmData.name"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-farm-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editFarmData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editFarmData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-farm-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editFarmData.farmCode),
      expression: "editFarmData.farmCode"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-farm-code",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editFarmData.farmCode)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editFarmData, "farmCode", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-farm-code"
    }
  }, [_vm._v("Farm Code")])]), _vm._v(" "), _vm._m(6), _vm._v(" "), _c('div', {
    staticClass: "input-field col s8"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.editFarmData.accreditationDate = val
      }
    },
    model: {
      value: (_vm.editFarmData.accreditationDate),
      callback: function($$v) {
        _vm.$set(_vm.editFarmData, "accreditationDate", $$v)
      },
      expression: "editFarmData.accreditationDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Accreditation Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editFarmData.accreditationNo),
      expression: "editFarmData.accreditationNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-farm-accreditation-no",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editFarmData.accreditationNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editFarmData, "accreditationNo", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-farm-accreditation-no"
    }
  }, [_vm._v("Accreditation No.")])]), _vm._v(" "), _vm._m(7), _vm._v(" "), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editFarmData.addressLine1),
      expression: "editFarmData.addressLine1"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-farm-address-one",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editFarmData.addressLine1)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editFarmData, "addressLine1", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-farm-address-one"
    }
  }, [_vm._v("Address Line 1")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editFarmData.addressLine2),
      expression: "editFarmData.addressLine2"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-farm-address-two",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editFarmData.addressLine2)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editFarmData, "addressLine2", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-farm-address-two"
    }
  }, [_vm._v("Address Line 2")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Province",
      "options": _vm.provinceOptions
    },
    on: {
      "select": function (val) {
        _vm.editFarmData.province = val
      }
    },
    model: {
      value: (_vm.editFarmData.province),
      callback: function($$v) {
        _vm.$set(_vm.editFarmData, "province", $$v)
      },
      expression: "editFarmData.province"
    }
  })], 1)])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action btn blue darken-1 z-depth-0 update-farm-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.updateFarm($event)
      }
    }
  }, [_vm._v("\n                Update\n            ")])])]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "renew-farm-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(8), _vm._v(" "), _c('h5', {
    staticClass: "grey-text text-darken-2"
  }, [_vm._v(" " + _vm._s(_vm.manageFarmsData.name) + " > " + _vm._s(_vm.renewFarmData.name))]), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(9), _vm._v(" "), _vm._m(10), _vm._v(" "), _vm._m(11), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.renewFarmData.newAccreditationDate = val
      }
    },
    model: {
      value: (_vm.renewFarmData.newAccreditationDate),
      callback: function($$v) {
        _vm.$set(_vm.renewFarmData, "newAccreditationDate", $$v)
      },
      expression: "renewFarmData.newAccreditationDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" New Accreditation Date ")])], 1)])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action btn orange darken-4 z-depth-0 renew-farm-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.renewFarm($event)
      }
    }
  }, [_vm._v("\n                Renew\n            ")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Add Farm\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br'), _vm._v(" "), _c('h6', [_c('b', [_vm._v("Accreditation")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br'), _vm._v(" "), _c('h6', [_c('b', [_vm._v("Farm Address")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Edit Farm\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br'), _vm._v(" "), _c('h6', [_c('b', [_vm._v("Accreditation")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br'), _vm._v(" "), _c('h6', [_c('b', [_vm._v("Farm Address")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Renew Farm\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br'), _c('br'), _c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('blockquote', {
    staticClass: "info"
  }, [_vm._v("\n                        Input new accreditation date to renew farm.\n                    ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6d46f7eb", module.exports)
  }
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s12",
    attrs: {
      "id": "toggle-register-breeder-btn-container"
    }
  }, [_c('a', {
    staticClass: "btn",
    attrs: {
      "id": "toggle-register-breeder-btn",
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        return _vm.showAddBreederModal($event)
      }
    }
  }, [_c('i', {
    staticClass: "material-icons left"
  }, [_vm._v("add")]), _vm._v(" Register Breeder\n            ")])]), _vm._v(" "), _vm._l((_vm.paginatedBreeders), function(breeder, index) {
    return [(breeder.userId !== -1) ? _c('div', {
      key: breeder.userId,
      staticClass: "col s6"
    }, [_c('div', {
      staticClass: "card",
      class: (_vm.manageFarmsData.paginatedBreederIndex === index) ? 'card-chosen-breeder' : ''
    }, [_c('div', {
      staticClass: "card-content"
    }, [_c('span', {
      staticClass: "card-title",
      class: (_vm.manageFarmsData.paginatedBreederIndex === index) ? 'name-chosen-breeder' : ''
    }, [_c('b', [_vm._v(_vm._s(breeder.name))])]), _vm._v(" "), _c('p', {
      staticClass: "grey-text text-darken-2"
    }, [_vm._v(" \n                            " + _vm._s(breeder.status) + " • " + _vm._s(breeder.email) + "\n                        ")]), _vm._v(" "), _c('p', [_c('br'), _vm._v(" "), _c('a', {
      staticClass: "black-text",
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showFarms(index)
        }
      }
    }, [_c('i', {
      staticClass: "material-icons left view-farm-btn"
    }, [_vm._v(" store ")]), _vm._v("\n                                Manage Farms\n                            ")])])]), _vm._v(" "), _c('div', {
      staticClass: "card-action grey lighten-3"
    }, [_c('a', {
      staticClass: "btn blue darken-1 toggle-edit-breeder-btn z-depth-0",
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showEditBreederModal(breeder.breederId)
        }
      }
    }, [_vm._v("\n                            Edit\n                        ")])])])]) : _c('div', {
      staticClass: "col s12"
    }, [_c('manage-farms', {
      attrs: {
        "manage-farms-data": _vm.manageFarmsData,
        "province-options": _vm.provinceOptions
      },
      on: {
        "close-manage-farms-event": _vm.closeManageFarmsContainer,
        "add-breeder-farm-event": _vm.addBreederFarm,
        "update-breeder-farm-event": _vm.updateBreederFarm,
        "renew-breeder-farm-event": _vm.renewBreederFarm
      }
    })], 1)]
  }), _vm._v(" "), _c('div', {
    staticClass: "col s12 center-align pagination-container"
  }, [_c('ul', {
    staticClass: "pagination"
  }, [_c('li', {
    class: (_vm.pageNumber === 0) ? 'disabled' : 'waves-effect'
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.previousPage()
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("chevron_left")])])]), _vm._v(" "), _vm._l((_vm.pageCount), function(i) {
    return _c('li', {
      staticClass: "waves-effect",
      class: (i === _vm.pageNumber + 1) ? 'active' : 'waves-effect'
    }, [_c('a', {
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.goToPage(i)
        }
      }
    }, [_vm._v(" " + _vm._s(i) + " ")])])
  }), _vm._v(" "), _c('li', {
    class: (_vm.pageNumber >= _vm.pageCount - 1) ? 'disabled' : 'waves-effect'
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.nextPage()
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("chevron_right")])])])], 2)])], 2), _vm._v(" "), _c('div', {
    staticClass: "modal",
    attrs: {
      "id": "add-breeder-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addBreederData.name),
      expression: "addBreederData.name"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-breeder-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addBreederData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addBreederData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-breeder-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addBreederData.email),
      expression: "addBreederData.email"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-breeder-email",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addBreederData.email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addBreederData, "email", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-breeder-email"
    }
  }, [_vm._v("Email")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action btn z-depth-0 register-breeder-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.registerBreeder($event)
      }
    }
  }, [_vm._v("\n                Register\n            ")])])]), _vm._v(" "), _c('div', {
    staticClass: "modal",
    attrs: {
      "id": "edit-breeder-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editBreederData.name),
      expression: "editBreederData.name"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-breeder-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editBreederData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editBreederData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-breeder-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editBreederData.email),
      expression: "editBreederData.email"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-breeder-email",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editBreederData.email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editBreederData, "email", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-breeder-email"
    }
  }, [_vm._v("Email")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action btn blue darken-1 z-depth-0 update-breeder-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.updateBreeder($event)
      }
    }
  }, [_vm._v("\n                Update\n            ")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" Manage Breeders ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Register Breeder\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Edit Breeder\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2b3e0810", module.exports)
  }
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(70)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(72),
  /* template */
  __webpack_require__(73),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-0298ef7c",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ManageEvaluators.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ManageEvaluators.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0298ef7c", Component.options)
  } else {
    hotAPI.reload("data-v-0298ef7c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("68e89ca6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0298ef7c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageEvaluators.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0298ef7c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageEvaluators.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.collection-header a[data-v-0298ef7c], #close-add-evaluator-container-button[data-v-0298ef7c] {\n    cursor: pointer;\n}\n.collection-item .row[data-v-0298ef7c] {\n    margin-bottom: 0;\n}\n.collection-item.avatar[data-v-0298ef7c] {\n    padding-left: 20px !important;\n}\n.custom-secondary-btn[data-v-0298ef7c] {\n    border: 1px solid;\n    background-color: white;\n}\n.custom-tertiary-btn[data-v-0298ef7c]:hover {\n    background-color: rgba(173, 173, 173, 0.3);\n}\n#add-evaluator-container[data-v-0298ef7c] {\n    padding-bottom: 2rem;\n}\n#edit-evaluator-modal[data-v-0298ef7c] {\n    width: 40rem;\n}\n#delete-evaluator-modal[data-v-0298ef7c] {\n    width: 30rem;\n}\n\n/* Modal customizations */\ndiv.modal-input-container[data-v-0298ef7c] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n.modal.modal-fixed-footer .modal-footer[data-v-0298ef7c] {\n    border: 0;\n}\n.modal .modal-footer[data-v-0298ef7c] {\n    padding-right: 2rem;\n}\n", ""]);

// exports


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        initialEvaluators: Array
    },

    data: function data() {
        return {
            evaluators: this.initialEvaluators,
            showAddEvaluatorContainer: false,
            addEvaluatorData: {
                name: '',
                email: ''
            },
            editEvaluatorData: {
                index: 0,
                userId: 0,
                name: '',
                email: ''
            },
            deleteEvaluatorData: {
                index: 0,
                userId: 0,
                name: ''
            }
        };
    },


    computed: {
        sortedEvaluators: function sortedEvaluators() {
            return _.sortBy(this.evaluators, ['name']);
        }
    },

    methods: {
        findEvaluatorIndexById: function findEvaluatorIndexById(id) {
            for (var i = 0; i < this.evaluators.length; i++) {
                if (this.evaluators[i].evaluatorId === id) return i;
            }

            return -1;
        },
        addEvaluator: function addEvaluator(event) {
            var _this = this;

            var vm = this;
            var addEvaluatorButton = $('.add-evaluator-btn');

            this.disableButtons(addEvaluatorButton, event.target, 'Adding...');

            // Add to server's database
            axios.post('/admin/manage/evaluators', {
                name: vm.addEvaluatorData.name,
                email: vm.addEvaluatorData.email
            }).then(function (response) {
                // Put response in local data storage and erase adding of evaluator data
                vm.evaluators.push(response.data);
                vm.addEvaluatorData = {
                    name: '',
                    email: ''
                };

                // Update UI after adding evaluator
                vm.$nextTick(function () {
                    $('#add-name').removeClass('valid');
                    $('#add-email').removeClass('valid');

                    _this.enableButtons(addEvaluatorButton, event.target, 'Add Evaluator');

                    Materialize.updateTextFields();
                    Materialize.toast('Evaluator ' + response.data.name + ' added', 3000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        showEditEvaluatorModal: function showEditEvaluatorModal(evaluatorId) {
            // Initialize data for editing
            var index = this.findEvaluatorIndexById(evaluatorId);
            var evaluator = this.evaluators[index];

            this.editEvaluatorData.index = index;
            this.editEvaluatorData.userId = evaluator.userId;
            this.editEvaluatorData.name = evaluator.name;
            this.editEvaluatorData.email = evaluator.email;

            $('#edit-evaluator-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },
        updateEvaluator: function updateEvaluator(event) {
            var _this2 = this;

            var vm = this;
            var updateEvaluatorButton = $('.update-evaluator-btn');

            this.disableButtons(updateEvaluatorButton, event.target, 'Updating...');

            // Update to server's database
            axios.patch('/admin/manage/evaluators', {
                userId: vm.editEvaluatorData.userId,
                name: vm.editEvaluatorData.name,
                email: vm.editEvaluatorData.email
            }).then(function (response) {
                // Put response in local data storage and erase editing of evaluator data
                if (response.data.updated) {
                    var index = vm.editEvaluatorData.index;

                    vm.evaluators[index].name = vm.editEvaluatorData.name;
                    vm.evaluators[index].email = vm.editEvaluatorData.email;
                    vm.editEvaluatorData = {
                        index: 0,
                        userId: 0,
                        name: '',
                        email: ''
                    };

                    // Update UI after updating breeder
                    vm.$nextTick(function () {
                        $('#edit-evaluator-modal').modal('close');
                        $('#edit-name').removeClass('valid');
                        $('#edit-email').removeClass('valid');

                        _this2.enableButtons(updateEvaluatorButton, event.target, 'Update');

                        Materialize.updateTextFields();
                        Materialize.toast(vm.evaluators[index].name + ' updated', 2500, 'green lighten-1');
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        showDeleteEvaluatorModal: function showDeleteEvaluatorModal(evaluatorId) {
            // Initialize data for deleting
            var index = this.findEvaluatorIndexById(evaluatorId);
            var evaluator = this.evaluators[index];

            this.deleteEvaluatorData.index = index;
            this.deleteEvaluatorData.userId = evaluator.userId;
            this.deleteEvaluatorData.name = evaluator.name;

            $('#delete-evaluator-modal').modal('open');
        },
        deleteEvaluator: function deleteEvaluator(event) {
            var _this3 = this;

            var vm = this;
            var deleteEvaluatorButton = $('.delete-evaluator-btn');

            this.disableButtons(deleteEvaluatorButton, event.target, 'Deleting...');

            // Remove from server's database
            axios.delete('/admin/manage/evaluators/' + vm.deleteEvaluatorData.userId).then(function (response) {
                // Remove evaluator details on local storage and erase
                // deleting of evaluator data
                if (response.data.deleted) {
                    var evaluatorName = vm.deleteEvaluatorData.name;

                    vm.evaluators.splice(vm.deleteEvaluatorData.index, 1);
                    vm.deleteEvaluatorData = {
                        index: 0,
                        userId: 0,
                        name: ''
                    };

                    // Update UI after deleting evaluator
                    vm.$nextTick(function () {
                        $('#delete-evaluator-modal').modal('close');

                        _this3.enableButtons(deleteEvaluatorButton, event.target, 'Delete');

                        Materialize.updateTextFields();
                        Materialize.toast('Evaluator ' + evaluatorName + ' deleted', 3000, 'green lighten-1');
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
});

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('ul', {
    staticClass: "collection with-header"
  }, [_c('li', {
    staticClass: "collection-header"
  }, [_c('a', {
    staticClass: "btn-floating waves-effect waves-light tooltipped",
    attrs: {
      "href": "#!",
      "id": "toggle-add-evaluator-container-button",
      "data-position": "right",
      "data-delay": "50",
      "data-tooltip": "Add new evaluator"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showAddEvaluatorContainer = !_vm.showAddEvaluatorContainer
      }
    }
  }, [_c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("add")])])]), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showAddEvaluatorContainer),
      expression: "showAddEvaluatorContainer"
    }],
    staticClass: "collection-item",
    attrs: {
      "id": "add-evaluator-container"
    }
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('i', {
    staticClass: "material-icons right",
    attrs: {
      "id": "close-add-evaluator-container-button"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showAddEvaluatorContainer = !_vm.showAddEvaluatorContainer
      }
    }
  }, [_vm._v("\n                            close\n                        ")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addEvaluatorData.name),
      expression: "addEvaluatorData.name"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addEvaluatorData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addEvaluatorData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addEvaluatorData.email),
      expression: "addEvaluatorData.email"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-email",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addEvaluatorData.email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addEvaluatorData, "email", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-email"
    }
  }, [_vm._v("Email")])]), _vm._v(" "), _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('a', {
    staticClass: "right btn z-depth-0 add-evaluator-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addEvaluator($event)
      }
    }
  }, [_vm._v("\n                            Add Evaluator\n                        ")])])])]), _vm._v(" "), _vm._l((_vm.sortedEvaluators), function(evaluator) {
    return _c('li', {
      key: evaluator.userId,
      staticClass: "collection-item avatar"
    }, [_c('span', {
      staticClass: "title"
    }, [_c('b', [_vm._v(_vm._s(evaluator.name))])]), _vm._v(" "), _c('p', {}, [_vm._v("\n                    " + _vm._s(evaluator.email) + "\n                ")]), _vm._v(" "), _c('span', {
      staticClass: "secondary-content"
    }, [_c('a', {
      staticClass: "btn custom-secondary-btn\n                            edit-evaluator-button\n                            blue-text\n                            text-darken-1\n                            z-depth-0",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showEditEvaluatorModal(evaluator.evaluatorId)
        }
      }
    }, [_vm._v("\n                        Edit\n                    ")]), _vm._v(" "), _c('a', {
      staticClass: "btn btn-flat delete-evaluator-button custom-tertiary-btn",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showDeleteEvaluatorModal(evaluator.evaluatorId)
        }
      }
    }, [_vm._v("\n                        Delete\n                    ")])])])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "modal",
    attrs: {
      "id": "edit-evaluator-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editEvaluatorData.name),
      expression: "editEvaluatorData.name"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editEvaluatorData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editEvaluatorData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editEvaluatorData.email),
      expression: "editEvaluatorData.email"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-email",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editEvaluatorData.email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editEvaluatorData, "email", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-email"
    }
  }, [_vm._v("Email")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action btn blue darken-1 z-depth-0 update-evaluator-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.updateEvaluator($event)
      }
    }
  }, [_vm._v("\n                Update\n            ")])])]), _vm._v(" "), _c('div', {
    staticClass: "modal",
    attrs: {
      "id": "delete-evaluator-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('p', [_vm._v("\n                        Are you sure you want to delete "), _c('b', [_vm._v(_vm._s(_vm.deleteEvaluatorData.name))]), _vm._v(" ?\n                    ")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action btn red lighten-2 z-depth-0 delete-evaluator-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.deleteEvaluator($event)
      }
    }
  }, [_vm._v("\n                Delete\n            ")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" Manage Evaluators ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Edit Evaluator\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Delete Evaluator\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0298ef7c", module.exports)
  }
}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(75)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(77),
  /* template */
  __webpack_require__(78),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-0e4e505e",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ManageProperties.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ManageProperties.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0e4e505e", Component.options)
  } else {
    hotAPI.reload("data-v-0e4e505e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(76);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("64529a3a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0e4e505e\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageProperties.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0e4e505e\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageProperties.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.collection-header a[data-v-0e4e505e], .edit-property-button[data-v-0e4e505e], #close-add-property-container-button[data-v-0e4e505e] {\n    cursor: pointer;\n}\n.collection-item .row[data-v-0e4e505e] {\n    margin-bottom: 0;\n}\n.collection-item.avatar[data-v-0e4e505e] {\n    padding-left: 20px !important;\n}\n#add-property-container[data-v-0e4e505e] {\n    padding-bottom: 2rem;\n}\n#edit-property-modal[data-v-0e4e505e] {\n    width: 30rem;\n    height: 35rem;\n}\n.custom-secondary-btn[data-v-0e4e505e] {\n    border: 1px solid;\n    background-color: white;\n}\n\n/* Modal customizations */\ndiv.modal-input-container[data-v-0e4e505e] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n.modal.modal-fixed-footer .modal-footer[data-v-0e4e505e] {\n    border: 0;\n}\n.modal .modal-footer[data-v-0e4e505e] {\n    padding-right: 2rem;\n}\n\n", ""]);

// exports


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        initialProperties: Array
    },

    data: function data() {
        return {
            properties: this.initialProperties,
            showAddPropertyContainer: false,
            addPropertyData: {
                slug: '',
                property: '',
                definition: ''
            },
            editPropertyData: {
                index: -1,
                id: 0,
                slug: '',
                property: '',
                definition: ''
            }
        };
    },


    methods: {
        addProperty: function addProperty(event) {
            var _this = this;

            var vm = this;
            var addPropertyButton = $('.add-property-btn');

            this.disableButtons(addPropertyButton, event.target, 'Adding...');

            // Add to server's database
            axios.post('/admin/manage/properties', {
                slug: vm.addPropertyData.slug,
                property: vm.addPropertyData.property,
                definition: vm.addPropertyData.definition
            }).then(function (response) {
                // Put response in local data storage and erase adding of property data
                vm.properties.push(response.data);
                vm.addPropertyData = {
                    slug: '',
                    property: '',
                    definition: ''
                };

                // Update UI after adding property
                vm.$nextTick(function () {
                    $('#add-property').removeClass('valid');
                    $('#add-slug').removeClass('valid');
                    $('#add-definition').removeClass('valid');

                    _this.enableButtons(addPropertyButton, event.target, 'Add Property');

                    Materialize.updateTextFields();
                    Materialize.toast('Property added', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        toggleEditPropertyModal: function toggleEditPropertyModal(index) {
            // Initialize data for editing
            this.editPropertyData.index = index;
            this.editPropertyData.id = this.properties[index].id;
            this.editPropertyData.slug = this.properties[index].slug;
            this.editPropertyData.property = this.properties[index].property;
            this.editPropertyData.definition = this.properties[index].definition;

            $('#edit-property-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },
        updateProperty: function updateProperty(event) {
            var _this2 = this;

            var vm = this;
            var index = this.editPropertyData.index;
            var updatePropertyButton = $('.update-property-btn');

            this.disableButtons(updatePropertyButton, event.target, 'Updating...');

            // Update to server's database
            axios.patch('/admin/manage/properties', {
                propertyId: vm.editPropertyData.id,
                definition: vm.editPropertyData.definition
            }).then(function (response) {
                // Update local data storage and erase editing of property data
                if (response.data === 'OK') {
                    vm.properties[index].definition = vm.editPropertyData.definition;
                    vm.editPropertyData = {
                        index: -1,
                        id: 0,
                        slug: '',
                        property: '',
                        definition: ''
                    };
                }

                // Update UI after updating property
                vm.$nextTick(function () {
                    $('#edit-property-modal').modal('close');
                    $('#add-property').removeClass('valid');
                    $('#add-slug').removeClass('valid');
                    $('#add-definition').removeClass('valid');

                    _this2.enableButtons(updatePropertyButton, event.target, 'Update');

                    Materialize.updateTextFields();
                    Materialize.toast('Property updated', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        var _this3 = this;

        // Materialize component initializations
        $('.modal').modal();

        // Watch the respective property to produce a default slug
        this.$watch('addPropertyData.property', function (newValue) {
            _this3.addPropertyData.slug = _.snakeCase(newValue);
            _this3.$nextTick(function () {
                Materialize.updateTextFields();
            });
        });
    }
});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('ul', {
    staticClass: "collection with-header"
  }, [_c('li', {
    staticClass: "collection-header"
  }, [_c('a', {
    staticClass: "btn-floating waves-effect waves-light tooltipped",
    attrs: {
      "href": "#!",
      "id": "toggle-add-property-container-button",
      "data-position": "right",
      "data-delay": "50",
      "data-tooltip": "Add new property"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showAddPropertyContainer = !_vm.showAddPropertyContainer
      }
    }
  }, [_c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("add")])])]), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showAddPropertyContainer),
      expression: "showAddPropertyContainer"
    }],
    staticClass: "collection-item",
    attrs: {
      "id": "add-property-container"
    }
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('i', {
    staticClass: "material-icons right",
    attrs: {
      "id": "close-add-property-container-button"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showAddPropertyContainer = !_vm.showAddPropertyContainer
      }
    }
  }, [_vm._v("\n                            close\n                        ")])]), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addPropertyData.property),
      expression: "addPropertyData.property"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-property",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addPropertyData.property)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addPropertyData, "property", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-property"
    }
  }, [_vm._v("Property")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addPropertyData.slug),
      expression: "addPropertyData.slug"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-slug",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addPropertyData.slug)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addPropertyData, "slug", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-slug"
    }
  }, [_vm._v("Slug")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addPropertyData.definition),
      expression: "addPropertyData.definition"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-definition",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addPropertyData.definition)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addPropertyData, "definition", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-definition"
    }
  }, [_vm._v("Definition")])]), _vm._v(" "), _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('a', {
    staticClass: "right btn z-depth-0 add-property-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addProperty($event)
      }
    }
  }, [_vm._v("\n                            Add Property\n                        ")])])])]), _vm._v(" "), _vm._l((_vm.properties), function(property, index) {
    return _c('li', {
      staticClass: "collection-item avatar"
    }, [_c('span', {
      staticClass: "title"
    }, [_c('b', [_vm._v(_vm._s(property.property))])]), _vm._v(" "), _c('p', {
      staticClass: "grey-text"
    }, [_vm._v("\n                    Slug: " + _vm._s(property.slug) + " "), _c('br'), _vm._v("\n                    Definition: " + _vm._s(property.definition) + "\n                ")]), _vm._v(" "), _c('span', {
      staticClass: "secondary-content"
    }, [_c('a', {
      staticClass: "btn custom-secondary-btn\n                            edit-property-button\n                            blue-text\n                            text-darken-1\n                            z-depth-0",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleEditPropertyModal(index)
        }
      }
    }, [_vm._v("\n                        Edit\n                    ")])])])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "edit-property-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editPropertyData.property),
      expression: "editPropertyData.property"
    }],
    attrs: {
      "id": "edit-property",
      "type": "text",
      "disabled": ""
    },
    domProps: {
      "value": (_vm.editPropertyData.property)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editPropertyData, "property", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-property"
    }
  }, [_vm._v("Property")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editPropertyData.slug),
      expression: "editPropertyData.slug"
    }],
    attrs: {
      "id": "edit-slug",
      "type": "text",
      "disabled": ""
    },
    domProps: {
      "value": (_vm.editPropertyData.slug)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editPropertyData, "slug", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-slug"
    }
  }, [_vm._v("Slug")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editPropertyData.definition),
      expression: "editPropertyData.definition"
    }],
    staticClass: "validate",
    attrs: {
      "id": "edit-definition",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editPropertyData.definition)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editPropertyData, "definition", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-definition"
    }
  }, [_vm._v("Definition")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect btn-flat ",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action waves-effect btn blue darken-1 z-depth-0 update-property-btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.updateProperty($event)
      }
    }
  }, [_vm._v("\n                Update\n            ")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" Manage Properties ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('blockquote', {}, [_vm._v("\n                            Note that Property and Slug fields cannot be edited once\n                            it has been submitted already.\n                        ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                Edit Property\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0e4e505e", module.exports)
  }
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(80)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(82),
  /* template */
  __webpack_require__(83),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-13cd11b7",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ManageAPIs.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ManageAPIs.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-13cd11b7", Component.options)
  } else {
    hotAPI.reload("data-v-13cd11b7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(81);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("8717e40a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-13cd11b7\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageAPIs.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-13cd11b7\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageAPIs.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.collection-header a[data-v-13cd11b7],\n.edit-property-button[data-v-13cd11b7],\n#close-add-credentials-container-button[data-v-13cd11b7],\n#show-help-info-button[data-v-13cd11b7],\n#close-help-info-button[data-v-13cd11b7] {\n    cursor: pointer;\n}\n.collection-item.avatar[data-v-13cd11b7] {\n    padding-left: 20px !important;\n}\n#add-api-container[data-v-13cd11b7] {\n    padding-bottom: 2rem;\n}\n#edit-credentials-modal[data-v-13cd11b7] {\n    width: 50rem;\n    height: 25rem;\n}\n#delete-credentials-modal[data-v-13cd11b7] {\n    width: 40rem;\n    height: 23rem;\n}\n.custom-secondary-btn[data-v-13cd11b7] {\n    border: 1px solid;\n    background-color: white;\n}\n.custom-tertiary-btn[data-v-13cd11b7]:hover {\n    background-color: rgba(173, 173, 173, 0.3);\n}\n\n/* Modal customizations */\ndiv.modal-input-container[data-v-13cd11b7] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n}\n.modal.modal-fixed-footer .modal-footer[data-v-13cd11b7] {\n    border: 0;\n}\n.modal .modal-footer[data-v-13cd11b7] {\n    padding-right: 2rem;\n}\n\n", ""]);

// exports


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            clients: [],
            showHelpInfo: false,
            showAddCredentialsContainer: false,
            addCredentialsData: {
                name: '',
                redirect: 'http://localhost/callback'
            },
            editCredentialsData: {
                index: -1,
                id: 0,
                name: '',
                redirect: ''
            },
            deleteCredentialsData: {
                index: -1,
                id: 0,
                name: ''
            }
        };
    },


    methods: {
        getClients: function getClients() {
            var _this = this;

            axios.get('/oauth/clients').then(function (response) {
                _this.clients = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        addCredentials: function addCredentials(event) {
            var _this2 = this;

            var addButtons = $('.add-credentials-button');

            this.disableButtons(addButtons, event.target, 'Adding...');

            // Add to server's database
            axios.post('/oauth/clients', {
                name: this.addCredentialsData.name,
                redirect: this.addCredentialsData.redirect
            }).then(function (response) {
                // Put response in local data storage and erase adding of property data
                _this2.clients.unshift(response.data);
                _this2.addCredentialsData = {
                    name: '',
                    redirect: ''
                };

                // Update UI after adding credentials
                _this2.$nextTick(function () {
                    $('#add-credentials-name').removeClass('valid');
                    $('#add-credentials-redirect').removeClass('valid');

                    _this2.enableButtons(addButtons, event.target, 'Add Credentials');

                    Materialize.updateTextFields();
                    Materialize.toast('Credentials added', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        toggleEditCredentialsModal: function toggleEditCredentialsModal(index) {
            // Initialize data for editing
            this.editCredentialsData.index = index;
            this.editCredentialsData.id = this.clients[index].id;
            this.editCredentialsData.name = this.clients[index].name;
            this.editCredentialsData.redirect = this.clients[index].redirect;

            $('#edit-credentials-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },
        updateCredentials: function updateCredentials(event) {
            var _this3 = this;

            var index = this.editCredentialsData.index;
            var updateButtons = $('.update-credentials-button');

            this.disableButtons(updateButtons, event.target, 'Updating...');

            // Update to server's database
            axios.put('/oauth/clients/' + this.editCredentialsData.id, {
                name: this.editCredentialsData.name,
                redirect: this.editCredentialsData.redirect
            }).then(function (response) {
                var data = response.data;

                _this3.clients[index].name = data.name;
                _this3.clients[index].redirect = data.redirect;
                _this3.editCredentialsData = {
                    index: -1,
                    id: 0,
                    name: '',
                    redirect: ''
                };

                // Update UI after updating credentials
                _this3.$nextTick(function () {
                    $('#edit-credentials-modal').modal('close');
                    $('#add-credentials-name').removeClass('valid');
                    $('#add-credentials-redirect').removeClass('valid');

                    _this3.enableButtons(updateButtons, event.target, 'Update');

                    Materialize.updateTextFields();
                    Materialize.toast('Credentials updated', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        toggleDeleteCredentialsModal: function toggleDeleteCredentialsModal(index) {
            // Initialize data for deleting
            this.deleteCredentialsData.index = index;
            this.deleteCredentialsData.id = this.clients[index].id;
            this.deleteCredentialsData.name = this.clients[index].name;

            $('#delete-credentials-modal').modal('open');
        },
        deleteCredentials: function deleteCredentials(event) {
            var _this4 = this;

            var index = this.deleteCredentialsData.index;
            var deleteButtons = $('.delete-credentials-button');

            this.disableButtons(deleteButtons, event.target, 'Deleting...');

            // Delete from server's database
            axios.delete('/oauth/clients/' + this.deleteCredentialsData.id).then(function (response) {
                // Remove from local storage
                _this4.clients.splice(index, 1);

                // Update UI after deleting credentials
                _this4.$nextTick(function () {
                    $('#delete-credentials-modal').modal('close');

                    _this4.enableButtons(deleteButtons, event.target, 'Delete');

                    Materialize.toast('Credentials revoked', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal({
            dismissible: false
        });

        // Initialize data
        this.getClients();
    }
});

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v("\n                Manage API Credentials\n                "), _c('i', {
    staticClass: "material-icons tooltipped",
    attrs: {
      "id": "show-help-info-button",
      "data-position": "right",
      "data-delay": "50",
      "data-tooltip": "Click for help"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHelpInfo = !_vm.showHelpInfo
      }
    }
  }, [_vm._v("\n                    info_outline\n                ")])])]), _vm._v(" "), (_vm.showHelpInfo) ? _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('i', {
    staticClass: "material-icons right",
    attrs: {
      "id": "close-help-info-button"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHelpInfo = !_vm.showHelpInfo
      }
    }
  }, [_vm._v("\n                    close\n                ")])]), _vm._v(" "), _vm._m(0)]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('ul', {
    staticClass: "collection with-header"
  }, [_c('li', {
    staticClass: "collection-header"
  }, [_c('a', {
    staticClass: "btn-floating waves-effect waves-light tooltipped",
    attrs: {
      "href": "#!",
      "id": "toggle-add-credentials-container-button",
      "data-position": "right",
      "data-delay": "50",
      "data-tooltip": "Add new Credentials"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showAddCredentialsContainer = !_vm.showAddCredentialsContainer
      }
    }
  }, [_c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("add")])])]), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showAddCredentialsContainer),
      expression: "showAddCredentialsContainer"
    }],
    staticClass: "collection-item",
    attrs: {
      "id": "add-api-container"
    }
  }, [_c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('i', {
    staticClass: "material-icons right",
    attrs: {
      "id": "close-add-credentials-container-button"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showAddCredentialsContainer = !_vm.showAddCredentialsContainer
      }
    }
  }, [_vm._v("\n                                close\n                            ")])]), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addCredentialsData.name),
      expression: "addCredentialsData.name"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-credentials-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addCredentialsData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addCredentialsData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-credentials-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s4 offset-s4"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.addCredentialsData.redirect),
      expression: "addCredentialsData.redirect"
    }],
    staticClass: "validate",
    attrs: {
      "id": "add-credentials-redirect",
      "type": "text"
    },
    domProps: {
      "value": (_vm.addCredentialsData.redirect)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.addCredentialsData, "redirect", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-credentials-redirect"
    }
  }, [_vm._v("Redirect")])]), _vm._v(" "), _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('a', {
    staticClass: "right btn add-credentials-button z-depth-0",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addCredentials($event)
      }
    }
  }, [_vm._v("\n                                Add Credentials\n                            ")])])])]), _vm._v(" "), (_vm.clients.length < 1) ? [_vm._m(2)] : _vm._l((_vm.clients), function(client, index) {
    return _c('li', {
      key: client.id,
      staticClass: "collection-item avatar"
    }, [_c('span', {
      staticClass: "title"
    }, [_c('b', [_vm._v(" " + _vm._s(client.name) + " ")])]), _vm._v(" "), _c('p', {
      staticClass: "grey-text"
    }, [_vm._v("\n                        CLIENT_ID: " + _vm._s(client.id) + " "), _c('br'), _vm._v("\n                        CLIENT_SECRET: " + _vm._s(client.secret) + " "), _c('br'), _vm._v("\n                        Redirect: " + _vm._s(client.redirect) + "\n                    ")]), _vm._v(" "), _c('span', {
      staticClass: "secondary-content"
    }, [_c('a', {
      staticClass: "btn edit-credentials-button \n                                custom-secondary-btn\n                                blue-text \n                                text-darken-1\n                                z-depth-0",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleEditCredentialsModal(index)
        }
      }
    }, [_vm._v("\n                            Edit\n                        ")]), _vm._v(" "), _c('a', {
      staticClass: "btn btn-flat delete-credentials-button custom-tertiary-btn",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleDeleteCredentialsModal(index)
        }
      }
    }, [_vm._v("\n                            Delete\n                        ")])])])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "edit-credentials-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editCredentialsData.name),
      expression: "editCredentialsData.name"
    }],
    attrs: {
      "id": "edit-credentials-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editCredentialsData.name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editCredentialsData, "name", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-credentials-name"
    }
  }, [_vm._v("Name")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.editCredentialsData.redirect),
      expression: "editCredentialsData.redirect"
    }],
    attrs: {
      "id": "edit-credentials-redirect",
      "type": "text"
    },
    domProps: {
      "value": (_vm.editCredentialsData.redirect)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.editCredentialsData, "redirect", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-credentials-redirect"
    }
  }, [_vm._v("Redirect")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect btn-flat update-credentials-button",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action \n                        waves-effect \n                        btn\n                        update-credentials-button\n                        blue darken-1\n                        z-depth-0",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.updateCredentials($event)
      }
    }
  }, [_vm._v("\n                    Update\n                ")])])]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "delete-credentials-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(5), _vm._v(" "), _c('div', {
    staticClass: "row modal-input-container"
  }, [_vm._m(6), _vm._v(" "), _c('p'), _c('blockquote', {
    staticClass: "error"
  }, [_vm._v("\n                            THIS ACTION CANNOT BE UNDONE.\n                        ")]), _vm._v("\n                        Are you sure you want to delete credentials for "), _c('b', [_vm._v(_vm._s(_vm.deleteCredentialsData.name))]), _vm._v("? "), _c('br'), _vm._v(" "), _c('p')])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer grey lighten-3"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect btn-flat delete-credentials-button",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action \n                    waves-effect \n                    btn \n                    delete-credentials-button\n                    red lighten-2\n                    z-depth-0",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.deleteCredentials($event)
      }
    }
  }, [_vm._v("\n                    Delete\n                ")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('blockquote', {}, [_vm._v("\n                    Note that the API credentials are for machine-to-machine communication. "), _c('br'), _vm._v("\n                    See "), _c('a', {
    attrs: {
      "href": "https://oauth.net/2/grant-types/client-credentials/"
    }
  }, [_vm._v("Client Credentials Grant")]), _vm._v("\n                    for more information.\n                ")]), _vm._v(" "), _c('pre', [_c('code', [_vm._v("\n1. After the client credentials are created, get your access token\n    by making a POST request to 'http://breedregistry.test/oauth/token'\n    w/ the following body data:\n\n    {\n        grant_type: 'client_credentials',\n        client_id: <client_id>,\n        client_secret: <client_secret>\n    }\n\n2. Now when the access token is acquired, every request in our API should\n    include and Authorization header with the acquired access token.\n    For example, GET request to 'http://breedregistry.test/api/v1/swines'\n    should include the following the Authorization header:\n\n    {\n        Authorization: Bearer <access_token>\n    }\n")]), _vm._v("\n                ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('blockquote', {}, [_vm._v("\n                                Note that the Client ID and Secret will be sent to your email as well.\n                            ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "collection-item avatar center-align"
  }, [_c('span', {
    staticClass: "title"
  }, [_vm._v(" No clients yet.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                    Edit Credentials\n                    "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("\n                    Delete Credentials\n                    "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-13cd11b7", module.exports)
  }
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(85)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(87),
  /* template */
  __webpack_require__(118),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-ee7fd1e0",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterSwine.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterSwine.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ee7fd1e0", Component.options)
  } else {
    hotAPI.reload("data-v-ee7fd1e0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(86);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("eab6435a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ee7fd1e0\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwine.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ee7fd1e0\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwine.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.tab a.active[data-v-ee7fd1e0] {\n    color: #c62828 !important;\n}\n.tab.disabled a[data-v-ee7fd1e0] {\n    color: #9e9e9e !important;\n    cursor: not-allowed !important;\n}\n.tabs .indicator[data-v-ee7fd1e0] {\n    background-color: #c62828 !important;\n}\n", ""]);

// exports


/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsProperties_vue__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsProperties_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsProperties_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RegisterSwineProperties_vue__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__RegisterSwineProperties_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__RegisterSwineProperties_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RegisterSwineSummary_vue__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RegisterSwineSummary_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__RegisterSwineSummary_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__RegisterSwineUploadPhoto_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__RegisterSwineUploadPhoto_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__RegisterSwineUploadPhoto_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        farmoptions: Array,
        breeds: Array,
        uploadurl: String
    },

    components: {
        RegisterSwineParentsProperties: __WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsProperties_vue___default.a,
        RegisterSwineProperties: __WEBPACK_IMPORTED_MODULE_1__RegisterSwineProperties_vue___default.a,
        RegisterSwineSummary: __WEBPACK_IMPORTED_MODULE_2__RegisterSwineSummary_vue___default.a,
        RegisterSwineUploadPhoto: __WEBPACK_IMPORTED_MODULE_3__RegisterSwineUploadPhoto_vue___default.a
    },

    data: function data() {
        return {
            tabDisables: {
                summary: true,
                photos: true
            }
        };
    },


    computed: {
        gpOneId: function gpOneId() {
            return this.$store.state.registerSwine.gpOne.id;
        },

        gpOneBreedId: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.breedId;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'breedId',
                    value: value
                });
            }
        },
        gpOneSex: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.sex;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'sex',
                    value: value
                });
            }
        },
        gpOneBirthDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.birthDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'birthDate',
                    value: value
                });
            }
        },
        gpOneFarmFromId: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.farmFromId;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'farmFromId',
                    value: value
                });
            }
        }
    },

    methods: {
        getIndex: function getIndex(id, arrayToBeSearched) {
            // Return index of object to find
            for (var i = 0; i < arrayToBeSearched.length; i++) {
                if (arrayToBeSearched[i].id === id) return i;
            }
        },
        goToTab: function goToTab(tabId) {
            // Function used in tab navigation links
            if (tabId === 'summary') {
                this.tabDisables.summary = false;

                // Add onbeforeunload event to help users from discarding changes
                // they have made in registering swine
                window.onbeforeunload = function (e) {
                    var dialogText = 'Changes you made may not be saved.';
                    e.returnValue = dialogText;
                    return dialogText;
                };
            } else if (tabId === 'photos') {
                this.tabDisables.photos = false;
            }

            this.$nextTick(function () {
                $('#add-swine-tabs ul.tabs').tabs('select_tab', tabId);
                // Scroll animation
                $('html, body').animate({
                    scrollTop: $('#add-swine-tabs').offset().top - 70 + "px"
                }, 500);
            });
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(89)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(91),
  /* template */
  __webpack_require__(97),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-17cbae1c",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterSwineParentsProperties.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterSwineParentsProperties.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-17cbae1c", Component.options)
  } else {
    hotAPI.reload("data-v-17cbae1c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(90);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("2dc705b9", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-17cbae1c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineParentsProperties.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-17cbae1c\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineParentsProperties.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\ndiv.collapsible-body[data-v-17cbae1c] {\n    overflow: auto;\n}\n", ""]);

// exports


/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsPropertiesInputs_vue__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsPropertiesInputs_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsPropertiesInputs_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        farmoptions: Array
    },

    components: {
        RegisterSwineParentsPropertiesInputs: __WEBPACK_IMPORTED_MODULE_0__RegisterSwineParentsPropertiesInputs_vue___default.a
    },

    data: function data() {
        return {
            gpSireIdPrefix: 'gp-sire-',
            gpDamIdPrefix: 'gp-dam-',
            collapsibleStatus: {
                sire: true,
                dam: true
            }
        };
    },


    methods: {
        triggerGoToTabEvent: function triggerGoToTabEvent(tabId) {
            this.$emit('goToTabEvent', tabId);
        }
    },

    mounted: function mounted() {
        // Open GP Sire and GP Dam collapsible by default
        $('.collapsible').collapsible('open', 0);
        $('.collapsible').collapsible('open', 1);
    }
});

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(93)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(95),
  /* template */
  __webpack_require__(96),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-4df65ca5",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterSwineParentsPropertiesInputs.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterSwineParentsPropertiesInputs.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4df65ca5", Component.options)
  } else {
    hotAPI.reload("data-v-4df65ca5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("66331897", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4df65ca5\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineParentsPropertiesInputs.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4df65ca5\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineParentsPropertiesInputs.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        farmoptions: Array,
        parentGender: String,
        parentIdPrefix: String
    },

    data: function data() {
        return {
            status: 'existing',
            imported: 'no',
            existingButtonPressed: false,
            existingInputIsValid: true,
            existingInputDataError: '',
            existingInputDataSuccess: ''
        };
    },


    computed: {
        existingInputClass: function existingInputClass() {
            // determine returning 'valid' or 'invalid' class
            // depending on the response from the server
            if (this.gpParentExistingRegNo && this.existingButtonPressed) {
                return this.existingInputIsValid ? 'valid' : 'invalid';
            } else return '';
        },
        parentSex: function parentSex() {
            // get sex (male/female) of parent from its gender (sire/dam)
            return this.parentGender === 'Sire' ? 'male' : 'female';
        },
        prefixedGender: function prefixedGender() {
            // add gp prefix to parentGender
            return 'gp' + this.parentGender;
        },

        gpParentExistingRegNo: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].existingRegNo;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'existingRegNo',
                    value: value
                });
            }
        },
        gpParentImportedRegNo: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].imported.regNo;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'imported.regNo',
                    value: value
                });
            }
        },
        gpParentImportedFarmOfOrigin: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].imported.farmOfOrigin;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'imported.farmOfOrigin',
                    value: value
                });
            }
        },
        gpParentImportedCountryOfOrigin: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].imported.countryOfOrigin;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'imported.countryOfOrigin',
                    value: value
                });
            }
        },
        gpParentGeneticInfoId: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].geneticInfoId;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'geneticInfoId',
                    value: value
                });
            }
        },
        gpParentFarmSwineId: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].farmSwineId;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'farmSwineId',
                    value: value
                });
            }
        },
        gpParentFarmFromId: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].farmFromId;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'farmFromId',
                    value: value
                });
            }
        },
        gpParentBirthDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].birthDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'birthDate',
                    value: value
                });
            }
        },
        gpParentHouseType: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].houseType;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'houseType',
                    value: value
                });
            }
        },
        gpParentTeatNo: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].teatNo;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'teatNo',
                    value: value
                });
            }
        },
        gpParentAdgBirthEndDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].adgBirthEndDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'adgBirthEndDate',
                    value: value
                });
            }
        },
        gpParentAdgBirthEndWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].adgBirthEndWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'adgBirthEndWeight',
                    value: value
                });
            }
        },
        gpParentAdgTestStartDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].adgTestStartDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'adgTestStartDate',
                    value: value
                });
            }
        },
        gpParentAdgTestEndDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].adgTestEndDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'adgTestEndDate',
                    value: value
                });
            }
        },
        gpParentAdgTestStartWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].adgTestStartWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'adgTestStartWeight',
                    value: value
                });
            }
        },
        gpParentAdgTestEndWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].adgTestEndWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'adgTestEndWeight',
                    value: value
                });
            }
        },
        gpParentBft: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].bft;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'bft',
                    value: value
                });
            }
        },
        gpParentBftCollected: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].bftCollected;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'bftCollected',
                    value: value
                });
            }
        },
        gpParentFeedIntake: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].feedIntake;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'feedIntake',
                    value: value
                });
            }
        },
        gpParentBirthWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].birthWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'birthWeight',
                    value: value
                });
            }
        },
        gpParentLittersizeAliveMale: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].littersizeAliveMale;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'littersizeAliveMale',
                    value: value
                });
            }
        },
        gpParentLittersizeAliveFemale: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].littersizeAliveFemale;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'littersizeAliveFemale',
                    value: value
                });
            }
        },
        gpParentParity: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].parity;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'parity',
                    value: value
                });
            }
        },
        // get and set value from vuex store
        gpParentLittersizeWeaning: {
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].littersizeWeaning;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'littersizeWeaning',
                    value: value
                });
            }
        },
        gpParentLitterweightWeaning: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].litterweightWeaning;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'litterweightWeaning',
                    value: value
                });
            }
        },
        gpParentDateWeaning: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine['' + this.prefixedGender].dateWeaning;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: this.prefixedGender,
                    property: 'dateWeaning',
                    value: value
                });
            }
        }
    },

    methods: {
        simpleCatch: function simpleCatch() {
            var _this = this;

            // simple catch from stop and prevent event default from
            // gpParentExistingRegNo input text
            setTimeout(function () {
                _this.existingButtonPressed = false;
            }, 0);
        },
        checkParent: function checkParent(event) {
            var _this2 = this;

            var vm = this;
            var checkButton = $('#' + vm.parentIdPrefix + 'check');

            if (!this.gpParentExistingRegNo) {
                this.existingButtonPressed = false;
                return;
            }

            this.disableButtons(checkButton, event.target, 'Checking ' + vm.parentGender + '...');
            this.existingButtonPressed = true;

            // Fetch from server parent details
            axios.get('/breeder/manage-swine/get/' + vm.parentSex + '/' + vm.gpParentExistingRegNo).then(function (response) {
                // Check if object or string is returned
                // If object is returned then it is
                // a success else if it is a
                // string, it's a fail
                if (_typeof(response.data) === 'object') {
                    // Put response to vuex store
                    _this2.$store.commit('updateParent', {
                        instance: _this2.prefixedGender,
                        data: response.data
                    });

                    setTimeout(function () {
                        _this2.existingInputIsValid = true;
                        _this2.existingInputDataSuccess = vm.parentGender + ' exists.';
                        _this2.existingInputDataError = '';
                        Materialize.toast(vm.parentGender + ' exists.', 2500, 'green lighten-1');
                    }, 0);
                } else if (typeof response.data === 'string') {
                    setTimeout(function () {
                        _this2.existingInputIsValid = false;
                        _this2.existingInputDataError = response.data;
                        _this2.existingInputDataSuccess = '';
                        Materialize.toast(response.data, 3000, 'red darken-1');
                    }, 0);
                }

                _this2.enableButtons(checkButton, event.target, 'Check ' + vm.parentGender + ' if existing');
            }).catch(function (error) {
                console.log(error);
            });
        },
        updateParentPropertiesToDefault: function updateParentPropertiesToDefault() {
            // Update vuex store
            this.$store.commit('updateParent', {
                instance: this.prefixedGender,
                sex: this.parentSex,
                data: null
            });
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    watch: {
        'status': function status() {
            // update parent's properties to default
            this.updateParentPropertiesToDefault();

            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },

        'imported': function imported() {
            // update parent's properties to default
            this.updateParentPropertiesToDefault();

            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        }
    }
});

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12 m12 l6 offset-l3 parent-container",
    attrs: {
      "id": ""
    }
  }, [_c('div', {
    staticClass: "col s12"
  }, [_vm._m(0), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.status),
      expression: "status"
    }],
    attrs: {
      "name": _vm.parentIdPrefix + 'status',
      "type": "radio",
      "id": _vm.parentIdPrefix + 'new',
      "value": "new"
    },
    domProps: {
      "checked": _vm._q(_vm.status, "new")
    },
    on: {
      "change": function($event) {
        _vm.status = "new"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'new'
    }
  }, [_vm._v(_vm._s(_vm.parentGender) + " is not yet registered in the system")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.status),
      expression: "status"
    }],
    attrs: {
      "name": _vm.parentIdPrefix + 'status',
      "type": "radio",
      "id": _vm.parentIdPrefix + 'existing',
      "value": "existing"
    },
    domProps: {
      "checked": _vm._q(_vm.status, "existing")
    },
    on: {
      "change": function($event) {
        _vm.status = "existing"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'existing'
    }
  }, [_vm._v(_vm._s(_vm.parentGender) + " is currently registered in the system")])])]), _vm._v(" "), _vm._m(1), _vm._v(" "), (_vm.status === 'existing') ? [_c('div', {
    staticClass: "col s8 offset-s2 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentExistingRegNo),
      expression: "gpParentExistingRegNo"
    }],
    staticClass: "validate",
    class: _vm.existingInputClass,
    attrs: {
      "id": _vm.parentIdPrefix + 'reg-no',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentExistingRegNo)
    },
    on: {
      "focusout": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        return _vm.simpleCatch($event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentExistingRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'reg-no',
      "data-error": _vm.existingInputDataError,
      "data-success": _vm.existingInputDataSuccess
    }
  }, [_vm._v("\n                GP " + _vm._s(_vm.parentGender) + " Registration #\n            ")])]), _vm._v(" "), _c('div', {
    staticClass: "col s8 offset-s2 center-align"
  }, [_c('br'), _vm._v(" "), _c('a', {
    staticClass: "btn waves-effect waves-light z-depth-0",
    attrs: {
      "href": "#!",
      "id": _vm.parentIdPrefix + 'check',
      "type": "submit",
      "name": "action"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.checkParent($event)
      }
    }
  }, [_vm._v("\n                Check " + _vm._s(_vm.parentGender) + " if existing\n            ")])])] : (_vm.status === 'new') ? [_c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Is GP " + _vm._s(_vm.parentGender) + " imported?")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.imported),
      expression: "imported"
    }],
    attrs: {
      "name": _vm.parentIdPrefix + 'imported',
      "type": "radio",
      "id": _vm.parentIdPrefix + 'imported-yes',
      "value": "yes"
    },
    domProps: {
      "checked": _vm._q(_vm.imported, "yes")
    },
    on: {
      "change": function($event) {
        _vm.imported = "yes"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'imported-yes'
    }
  }, [_vm._v("Yes")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.imported),
      expression: "imported"
    }],
    attrs: {
      "name": _vm.parentIdPrefix + 'imported',
      "type": "radio",
      "id": _vm.parentIdPrefix + 'imported-no',
      "value": "no"
    },
    domProps: {
      "checked": _vm._q(_vm.imported, "no")
    },
    on: {
      "change": function($event) {
        _vm.imported = "no"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'imported-no'
    }
  }, [_vm._v("No")])])]), _vm._v(" "), _vm._m(2), _vm._v(" "), (_vm.imported === 'yes') ? [_c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentImportedRegNo),
      expression: "gpParentImportedRegNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'imported-reg-no',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentImportedRegNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentImportedRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'imported-reg-no'
    }
  }, [_vm._v("Imported Animal Registration #")])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentImportedFarmOfOrigin),
      expression: "gpParentImportedFarmOfOrigin"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'imported-farm-origin',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentImportedFarmOfOrigin)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentImportedFarmOfOrigin = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'imported-farm-origin'
    }
  }, [_vm._v("Farm Of Origin")])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentImportedCountryOfOrigin),
      expression: "gpParentImportedCountryOfOrigin"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'imported-country-origin',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentImportedCountryOfOrigin)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentImportedCountryOfOrigin = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'imported-country-origin'
    }
  }, [_vm._v("Country of Origin")])])] : (_vm.imported === 'no') ? [_c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentGeneticInfoId),
      expression: "gpParentGeneticInfoId"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'genetic-info-id',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentGeneticInfoId)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentGeneticInfoId = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'genetic-info-id'
    }
  }, [_vm._v("Genetic Information ID (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Farm Of Origin",
      "options": _vm.farmoptions
    },
    on: {
      "select": function (val) {
        _vm.gpParentFarmFromId = val
      }
    },
    model: {
      value: (_vm.gpParentFarmFromId),
      callback: function($$v) {
        _vm.gpParentFarmFromId = $$v
      },
      expression: "gpParentFarmFromId"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentFarmSwineId),
      expression: "gpParentFarmSwineId"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'farm-swine-id',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentFarmSwineId)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentFarmSwineId = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'farm-swine-id'
    }
  }, [_vm._v("Farm Swine ID / Earmark")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentTeatNo),
      expression: "gpParentTeatNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'teatno',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentTeatNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentTeatNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'teatno'
    }
  }, [_vm._v("Number of Teats")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpParentBirthDate = val
      }
    },
    model: {
      value: (_vm.gpParentBirthDate),
      callback: function($$v) {
        _vm.gpParentBirthDate = $$v
      },
      expression: "gpParentBirthDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Birth Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentBirthWeight),
      expression: "gpParentBirthWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'birth-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentBirthWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentBirthWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'birth-weight'
    }
  }, [_vm._v("Birth Weight (kg)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentLittersizeAliveMale),
      expression: "gpParentLittersizeAliveMale"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'total-m',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentLittersizeAliveMale)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentLittersizeAliveMale = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'total-m'
    }
  }, [_vm._v("Total (M) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentLittersizeAliveFemale),
      expression: "gpParentLittersizeAliveFemale"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'total-f',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentLittersizeAliveFemale)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentLittersizeAliveFemale = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'total-f'
    }
  }, [_vm._v("Total (F) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentLittersizeWeaning),
      expression: "gpParentLittersizeWeaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'littersize-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentLittersizeWeaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentLittersizeWeaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'littersize-weaning'
    }
  }, [_vm._v("Littersize at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentLitterweightWeaning),
      expression: "gpParentLitterweightWeaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'litterweight-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentLitterweightWeaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentLitterweightWeaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'litterweight-weaning'
    }
  }, [_vm._v("Litter weight at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpParentDateWeaning = val
      }
    },
    model: {
      value: (_vm.gpParentDateWeaning),
      callback: function($$v) {
        _vm.gpParentDateWeaning = $$v
      },
      expression: "gpParentDateWeaning"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date at weaning ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentParity),
      expression: "gpParentParity"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'parity',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentParity)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentParity = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'parity'
    }
  }, [_vm._v("Parity")])]), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_vm._m(4), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentHouseType),
      expression: "gpParentHouseType"
    }],
    attrs: {
      "name": _vm.parentIdPrefix + 'house-type',
      "type": "radio",
      "id": _vm.parentIdPrefix + 'house-type-tunnel',
      "value": "tunnel"
    },
    domProps: {
      "checked": _vm._q(_vm.gpParentHouseType, "tunnel")
    },
    on: {
      "change": function($event) {
        _vm.gpParentHouseType = "tunnel"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'house-type-tunnel'
    }
  }, [_vm._v("Tunnel ventilated")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentHouseType),
      expression: "gpParentHouseType"
    }],
    attrs: {
      "name": _vm.parentIdPrefix + 'house-type',
      "type": "radio",
      "id": _vm.parentIdPrefix + 'house-type-open',
      "value": "open"
    },
    domProps: {
      "checked": _vm._q(_vm.gpParentHouseType, "open")
    },
    on: {
      "change": function($event) {
        _vm.gpParentHouseType = "open"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'house-type-open'
    }
  }, [_vm._v("Open sided")])])]), _vm._v(" "), _vm._m(5), _vm._v(" "), _vm._m(6), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpParentAdgBirthEndDate = val
      }
    },
    model: {
      value: (_vm.gpParentAdgBirthEndDate),
      callback: function($$v) {
        _vm.gpParentAdgBirthEndDate = $$v
      },
      expression: "gpParentAdgBirthEndDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" End Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentAdgBirthEndWeight),
      expression: "gpParentAdgBirthEndWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'adg-birth-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentAdgBirthEndWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentAdgBirthEndWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'adg-birth-end-weight'
    }
  }, [_vm._v("End Weight (kg)")])]), _vm._v(" "), _vm._m(7), _vm._v(" "), _vm._m(8), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpParentAdgTestStartDate = val
      }
    },
    model: {
      value: (_vm.gpParentAdgTestStartDate),
      callback: function($$v) {
        _vm.gpParentAdgTestStartDate = $$v
      },
      expression: "gpParentAdgTestStartDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Start Date of Testing ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentAdgTestStartWeight),
      expression: "gpParentAdgTestStartWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'adg-test-start-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentAdgTestStartWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentAdgTestStartWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'adg-test-start-weight'
    }
  }, [_vm._v("Weight at Start of Testing (kg)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpParentAdgTestEndDate = val
      }
    },
    model: {
      value: (_vm.gpParentAdgTestEndDate),
      callback: function($$v) {
        _vm.gpParentAdgTestEndDate = $$v
      },
      expression: "gpParentAdgTestEndDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" End Date of Testing ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentAdgTestEndWeight),
      expression: "gpParentAdgTestEndWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'adg-test-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentAdgTestEndWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentAdgTestEndWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'adg-test-end-weight'
    }
  }, [_vm._v("Weight at End of Testing (kg)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentBft),
      expression: "gpParentBft"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'bft',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentBft)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentBft = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'bft'
    }
  }, [_vm._v("Backfat Thickness [BFT] (mm)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpParentBftCollected = val
      }
    },
    model: {
      value: (_vm.gpParentBftCollected),
      callback: function($$v) {
        _vm.gpParentBftCollected = $$v
      },
      expression: "gpParentBftCollected"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date when BFT was collected ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpParentFeedIntake),
      expression: "gpParentFeedIntake"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.parentIdPrefix + 'feed-intake',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpParentFeedIntake)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpParentFeedIntake = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.parentIdPrefix + 'feed-intake'
    }
  }, [_vm._v("Total Feed Intake during Test (kg)")])])] : _vm._e(), _vm._v(" "), _vm._m(9)] : _vm._e()], 2)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("Choose an option")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("House Type")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain (ADG) computation from Birth")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Swine Testing Information")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4df65ca5", module.exports)
  }
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row",
    attrs: {
      "id": "gp-parents"
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v("GP Parents")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('ul', {
    staticClass: "collapsible",
    attrs: {
      "data-collapsible": "expandable"
    }
  }, [_c('li', [_c('div', {
    staticClass: "collapsible-header",
    on: {
      "click": function($event) {
        _vm.collapsibleStatus.sire = !_vm.collapsibleStatus.sire
      }
    }
  }, [(_vm.collapsibleStatus.sire) ? [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v(" label_outline ")])] : [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v(" label ")])], _vm._v("\n                                    GP Sire\n                                ")], 2), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('register-swine-parents-properties-inputs', {
    attrs: {
      "farmoptions": _vm.farmoptions,
      "parent-gender": 'Sire',
      "parent-id-prefix": _vm.gpSireIdPrefix
    }
  })], 1)]), _vm._v(" "), _c('li', [_c('div', {
    staticClass: "collapsible-header",
    on: {
      "click": function($event) {
        _vm.collapsibleStatus.dam = !_vm.collapsibleStatus.dam
      }
    }
  }, [(_vm.collapsibleStatus.dam) ? [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v(" label_outline ")])] : [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v(" label ")])], _vm._v("\n                                    GP Dam\n                                ")], 2), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('register-swine-parents-properties-inputs', {
    attrs: {
      "farmoptions": _vm.farmoptions,
      "parent-gender": 'Dam',
      "parent-id-prefix": _vm.gpDamIdPrefix
    }
  })], 1)])])]), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light grey lighten-4 left",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.triggerGoToTabEvent('gp-1')
      }
    }
  }, [_c('i', {
    staticClass: "material-icons black-text"
  }, [_vm._v("arrow_back")])]), _vm._v(" "), _c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light blue right",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.triggerGoToTabEvent('summary')
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("arrow_forward")])])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-17cbae1c", module.exports)
  }
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(99)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(101),
  /* template */
  __webpack_require__(102),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-62492e3a",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterSwineProperties.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterSwineProperties.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-62492e3a", Component.options)
  } else {
    hotAPI.reload("data-v-62492e3a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(100);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("cc50fd36", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-62492e3a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineProperties.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-62492e3a\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineProperties.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            gpOneIdPrefix: 'gp-one-'
        };
    },


    computed: {
        gpOneGeneticInfoId: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.geneticInfoId;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'geneticInfoId',
                    value: value
                });
            }
        },
        gpOneFarmSwineId: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.farmSwineId;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'farmSwineId',
                    value: value
                });
            }
        },
        gpOneHouseType: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.houseType;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'houseType',
                    value: value
                });
            }
        },
        gpOneTeatNo: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.teatNo;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'teatNo',
                    value: value
                });
            }
        },
        gpOneAdgBirthEndDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.adgBirthEndDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'adgBirthEndDate',
                    value: value
                });
            }
        },
        gpOneAdgBirthEndWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.adgBirthEndWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'adgBirthEndWeight',
                    value: value
                });
            }
        },
        gpOneAdgTestStartDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.adgTestStartDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'adgTestStartDate',
                    value: value
                });
            }
        },
        gpOneAdgTestEndDate: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.adgTestEndDate;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'adgTestEndDate',
                    value: value
                });
            }
        },
        gpOneAdgTestStartWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.adgTestStartWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'adgTestStartWeight',
                    value: value
                });
            }
        },
        gpOneAdgTestEndWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.adgTestEndWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'adgTestEndWeight',
                    value: value
                });
            }
        },
        gpOneBft: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.bft;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'bft',
                    value: value
                });
            }
        },
        gpOneBftCollected: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.bftCollected;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'bftCollected',
                    value: value
                });
            }
        },
        gpOneFeedIntake: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.feedIntake;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'feedIntake',
                    value: value
                });
            }
        },
        gpOneBirthWeight: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.birthWeight;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'birthWeight',
                    value: value
                });
            }
        },
        gpOneLittersizeAliveMale: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.littersizeAliveMale;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'littersizeAliveMale',
                    value: value
                });
            }
        },
        gpOneLittersizeAliveFemale: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.littersizeAliveFemale;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'littersizeAliveFemale',
                    value: value
                });
            }
        },
        gpOneParity: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.parity;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'parity',
                    value: value
                });
            }
        },
        gpOneLittersizeWeaning: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.littersizeWeaning;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'littersizeWeaning',
                    value: value
                });
            }
        },
        gpOneLitterweightWeaning: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.litterweightWeaning;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'litterweightWeaning',
                    value: value
                });
            }
        },
        gpOneDateWeaning: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.dateWeaning;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'dateWeaning',
                    value: value
                });
            }
        }
    },

    methods: {
        triggerGoToTabEvent: function triggerGoToTabEvent(tabId) {
            this.$emit('goToTabEvent', tabId);
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row",
    attrs: {
      "id": "gp-1"
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v("GP 1")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12 m10 l6 offset-m1 offset-l3"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneGeneticInfoId),
      expression: "gpOneGeneticInfoId"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'genetic-info-id',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneGeneticInfoId)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneGeneticInfoId = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'genetic-info-id'
    }
  }, [_vm._v("Genetic Information ID (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneFarmSwineId),
      expression: "gpOneFarmSwineId"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'farm-swine-id',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneFarmSwineId)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneFarmSwineId = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'farm-swine-id'
    }
  }, [_vm._v("Farm Swine ID / Earmark")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneTeatNo),
      expression: "gpOneTeatNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'teatno',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneTeatNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneTeatNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'teatno'
    }
  }, [_vm._v("Number of Teats")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneBirthWeight),
      expression: "gpOneBirthWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'birth-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneBirthWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneBirthWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'birth-weight'
    }
  }, [_vm._v("Birth weight (kg)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneParity),
      expression: "gpOneParity"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'parity',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneParity)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneParity = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'parity'
    }
  }, [_vm._v("Parity")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneLittersizeAliveMale),
      expression: "gpOneLittersizeAliveMale"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'total-m',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneLittersizeAliveMale)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneLittersizeAliveMale = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'total-m'
    }
  }, [_vm._v("Total (M) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneLittersizeAliveFemale),
      expression: "gpOneLittersizeAliveFemale"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'total-f',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneLittersizeAliveFemale)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneLittersizeAliveFemale = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'total-f'
    }
  }, [_vm._v("Total (F) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneLittersizeWeaning),
      expression: "gpOneLittersizeWeaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'littersize-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneLittersizeWeaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneLittersizeWeaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'littersize-weaning'
    }
  }, [_vm._v("Littersize at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneLitterweightWeaning),
      expression: "gpOneLitterweightWeaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'litterweight-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneLitterweightWeaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneLitterweightWeaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'litterweight-weaning'
    }
  }, [_vm._v("Litter weight at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOneDateWeaning = val
      }
    },
    model: {
      value: (_vm.gpOneDateWeaning),
      callback: function($$v) {
        _vm.gpOneDateWeaning = $$v
      },
      expression: "gpOneDateWeaning"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date at weaning ")])], 1), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_vm._m(2), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneHouseType),
      expression: "gpOneHouseType"
    }],
    attrs: {
      "name": "house-type",
      "type": "radio",
      "id": "house-type-tunnel",
      "value": "tunnel"
    },
    domProps: {
      "checked": _vm._q(_vm.gpOneHouseType, "tunnel")
    },
    on: {
      "change": function($event) {
        _vm.gpOneHouseType = "tunnel"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "house-type-tunnel"
    }
  }, [_vm._v("Tunnel ventilated")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneHouseType),
      expression: "gpOneHouseType"
    }],
    attrs: {
      "name": "house-type",
      "type": "radio",
      "id": "house-type-open",
      "value": "open"
    },
    domProps: {
      "checked": _vm._q(_vm.gpOneHouseType, "open")
    },
    on: {
      "change": function($event) {
        _vm.gpOneHouseType = "open"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "house-type-open"
    }
  }, [_vm._v("Open sided")])])]), _vm._v(" "), _vm._m(3), _vm._v(" "), _vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOneAdgBirthEndDate = val
      }
    },
    model: {
      value: (_vm.gpOneAdgBirthEndDate),
      callback: function($$v) {
        _vm.gpOneAdgBirthEndDate = $$v
      },
      expression: "gpOneAdgBirthEndDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" End Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneAdgBirthEndWeight),
      expression: "gpOneAdgBirthEndWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'adg-birth-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneAdgBirthEndWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneAdgBirthEndWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'adg-birth-end-weight'
    }
  }, [_vm._v("End Weight (kg)")])]), _vm._v(" "), _vm._m(5), _vm._v(" "), _vm._m(6), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOneAdgTestStartDate = val
      }
    },
    model: {
      value: (_vm.gpOneAdgTestStartDate),
      callback: function($$v) {
        _vm.gpOneAdgTestStartDate = $$v
      },
      expression: "gpOneAdgTestStartDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Start Date of Testing ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneAdgTestStartWeight),
      expression: "gpOneAdgTestStartWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'adg-test-start-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneAdgTestStartWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneAdgTestStartWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'adg-test-start-weight'
    }
  }, [_vm._v("Weight at Start of Testing (kg)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOneAdgTestEndDate = val
      }
    },
    model: {
      value: (_vm.gpOneAdgTestEndDate),
      callback: function($$v) {
        _vm.gpOneAdgTestEndDate = $$v
      },
      expression: "gpOneAdgTestEndDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" End Date  of Testing ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneAdgTestEndWeight),
      expression: "gpOneAdgTestEndWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'adg-test-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneAdgTestEndWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneAdgTestEndWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'adg-test-end-weight'
    }
  }, [_vm._v("Weight at End of Testing (kg)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneBft),
      expression: "gpOneBft"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'bft',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneBft)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneBft = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'bft'
    }
  }, [_vm._v("Backfat Thickness [BFT] (mm)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOneBftCollected = val
      }
    },
    model: {
      value: (_vm.gpOneBftCollected),
      callback: function($$v) {
        _vm.gpOneBftCollected = $$v
      },
      expression: "gpOneBftCollected"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date when BFT was collected ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneFeedIntake),
      expression: "gpOneFeedIntake"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'feed-intake',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOneFeedIntake)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOneFeedIntake = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'feed-intake'
    }
  }, [_vm._v("Total Feed Intake during Test (kg)")])]), _vm._v(" "), _vm._m(7)]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light grey lighten-4 left",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.triggerGoToTabEvent('basic-information')
      }
    }
  }, [_c('i', {
    staticClass: "material-icons black-text"
  }, [_vm._v("arrow_back")])]), _vm._v(" "), _c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light blue right",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.triggerGoToTabEvent('gp-parents')
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("arrow_forward")])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("House Type")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain (ADG) computation from Birth")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Swine Testing Information")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-62492e3a", module.exports)
  }
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(104)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(106),
  /* template */
  __webpack_require__(107),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-4aec38b4",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterSwineSummary.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterSwineSummary.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4aec38b4", Component.options)
  } else {
    hotAPI.reload("data-v-4aec38b4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(105);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("3e7f32f6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4aec38b4\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineSummary.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4aec38b4\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineSummary.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.summary-table td[data-v-4aec38b4] {\n    padding: 0;\n}\n.summary-table tr td[data-v-4aec38b4]:first-child {\n    color: #757575;\n}\n.summary-table tr td[data-v-4aec38b4]:last-child {\n    color: black;\n}\n#summary > .card[data-v-4aec38b4] {\n    padding: 0;\n}\n#summary-card-action[data-v-4aec38b4] {\n    border-top: 0;\n    background-color: rgba(236, 239, 241, 0.7);\n}\n#swinecart-container div.row[data-v-4aec38b4] {\n    margin-bottom: 0px;\n}\n#swinecart-container div.row[data-v-4aec38b4] {\n    padding-top: 1rem;\n}\n\n/* Accent highlights on cards */\n#swineinfo-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #2672a6;\n}\n#swinecart-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #26a69a;\n}\n#gp-sire-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #9a26a6;\n}\n#gp-dam-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #a69a26;\n}\n", ""]);

// exports


/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        breeds: Array,
        farmoptions: Array
    },

    data: function data() {
        return {
            successfullyRegistered: false
        };
    },


    computed: {
        tempRegistryCertificateLink: function tempRegistryCertificateLink() {
            return '/breeder/temp-registry-certificate';
        },
        registryCertificateLink: function registryCertificateLink() {
            var certificateLink = '/breeder/registry-certificate';
            var gpOneId = this.gpOneData.id;
            return certificateLink + '/' + gpOneId;
        },
        gpOneData: function gpOneData() {
            return this.$store.getters.gpOneData;
        },
        gpOneComputedAdgFromBirth: function gpOneComputedAdgFromBirth() {
            return this.$store.getters.computedAdgFromBirth('gpOne');
        },
        gpOneComputedAdgOnTest: function gpOneComputedAdgOnTest() {
            return this.$store.getters.computedAdgOnTest('gpOne');
        },
        gpOneComputedFeedEfficiency: function gpOneComputedFeedEfficiency() {
            return this.$store.getters.computedFeedEfficiency('gpOne');
        },
        gpSireData: function gpSireData() {
            return this.$store.getters.gpSireData;
        },
        gpSireComputedAdgFromBirth: function gpSireComputedAdgFromBirth() {
            return this.$store.getters.computedAdgFromBirth('gpSire');
        },
        gpSireComputedAdgOnTest: function gpSireComputedAdgOnTest() {
            return this.$store.getters.computedAdgOnTest('gpSire');
        },
        gpSireComputedFeedEfficiency: function gpSireComputedFeedEfficiency() {
            return this.$store.getters.computedFeedEfficiency('gpSire');
        },
        gpDamData: function gpDamData() {
            return this.$store.getters.gpDamData;
        },
        gpDamComputedAdgFromBirth: function gpDamComputedAdgFromBirth() {
            return this.$store.getters.computedAdgFromBirth('gpDam');
        },
        gpDamComputedAdgOnTest: function gpDamComputedAdgOnTest() {
            return this.$store.getters.computedAdgOnTest('gpDam');
        },
        gpDamComputedFeedEfficiency: function gpDamComputedFeedEfficiency() {
            return this.$store.getters.computedFeedEfficiency('gpDam');
        },

        gpOneSwinecart: {
            // get and set value from vuex store
            get: function get() {
                return this.$store.state.registerSwine.gpOne.swinecart;
            },
            set: function set(value) {
                this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'swinecart',
                    value: value
                });
            }
        }
    },

    methods: {
        transformFarmId: function transformFarmId(id) {
            return id > 0 ? this.farmoptions[id - 1].text : '';
        },
        transformBreedId: function transformBreedId(id) {
            return id > 0 ? this.breeds[id - 1].text : '';
        },
        capitalize: function capitalize(string) {
            return _.capitalize(string);
        },
        registerSwine: function registerSwine(event) {
            var _this = this;

            var gpOneData = this.gpOneData;
            var gpSireData = this.gpSireData;
            var gpDamData = this.gpDamData;
            var submitButton = $('.register-and-generate-cert');

            this.disableButtons(submitButton, event.target, 'Registering...');

            // Attach derived values such as ADG, FE, and breedId
            // for parents to original object before submit
            gpOneData.adgBirth = this.gpOneComputedAdgFromBirth;
            gpOneData.adgTest = this.gpOneComputedAdgOnTest;
            gpOneData.feedEfficiency = this.gpOneComputedFeedEfficiency;
            gpSireData.adgBirth = this.gpSireComputedAdgFromBirth;
            gpSireData.adgTest = this.gpSireComputedAdgOnTest;
            gpSireData.feedEfficiency = this.gpSireComputedFeedEfficiency;
            gpSireData.breedId = gpOneData.breedId;
            gpSireData.status = this.determineStatus(gpSireData);
            gpDamData.adgBirth = this.gpDamComputedAdgFromBirth;
            gpDamData.adgTest = this.gpDamComputedAdgOnTest;
            gpDamData.feedEfficiency = this.gpDamComputedFeedEfficiency;
            gpDamData.breedId = this.gpOneData.breedId;
            gpDamData.status = this.determineStatus(gpDamData);

            // Add to server's database
            axios.post('/breeder/manage-swine/register', {
                gpOne: gpOneData,
                gpSire: gpSireData,
                gpDam: gpDamData
            }).then(function (response) {
                var data = response.data;

                // Mutate state of gpOne
                _this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'id',
                    value: data.id
                });

                _this.$store.commit('updateValue', {
                    instance: 'gpOne',
                    property: 'regNo',
                    value: data.registration_no
                });

                _this.successfullyRegistered = true;
                // this.enableButtons(submitButton, event.target, 'Register Swine and Generate Certificate');
                Materialize.toast('Registration Successful! You can now upload swine photos', 4000, 'green lighten-1');
            }).catch(function (error) {
                console.log(error);
            });
        },
        determineStatus: function determineStatus(parentData) {
            // Help determine if parent to be added is
            // registered, imported, or new
            var status = '';

            if (parentData.existingRegNo) status = 'registered';else if (parentData.imported.regNo) status = 'imported';else status = 'new';

            return status;
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        triggerGoToTabEvent: function triggerGoToTabEvent(tabId) {
            this.$emit('goToTabEvent', tabId);
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row",
    attrs: {
      "id": "summary"
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v("Summary")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12 m12 l6 offset-l3",
    attrs: {
      "id": "swineinfo-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('table', {
    staticClass: "striped summary-table"
  }, [_c('tbody', [_c('tr', [_c('td', [_vm._v(" Genetic Information ID (optional) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.geneticInfoId) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm Of Origin ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.transformFarmId(_vm.gpOneData.farmFromId)) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm Swine ID / Earmark ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.farmSwineId) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Breed ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.transformBreedId(_vm.gpOneData.breedId)) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Sex ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.capitalize(_vm.gpOneData.sex)) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Number of Teats ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.teatNo) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Date ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.birthDate) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Weight ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.birthWeight) + " kg")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Parity ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.parity) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (M) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersizeAliveMale) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (F) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersizeAliveFemale) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Littersize at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersizeWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total litterweight at weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.litterweightWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.dateWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Adjusted ADG from Birth (180 days) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneComputedAdgFromBirth) + " kg/day")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Adjusted ADG on Test (90-150 days) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneComputedAdgOnTest) + " kg/day")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Feed Efficiency ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneComputedFeedEfficiency) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Backfat Thickness (BFT) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.bft) + " mm")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date of BFT Collection ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.bftCollected) + " ")])])])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12 m12 l6",
    attrs: {
      "id": "gp-sire-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('h6', {
    staticClass: "center-align"
  }, [(_vm.gpSireData.existingRegNo) ? [_c('b', [_vm._v("\n                                        GP Sire Information\n                                        (Registered)\n                                    ")])] : (_vm.gpSireData.imported.regNo) ? [_c('b', [_vm._v("\n                                        GP Sire Information\n                                        (Imported)\n                                    ")])] : [_c('b', [_vm._v("\n                                        GP Sire Information\n                                        (New)\n                                    ")])]], 2), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('table', {
    staticClass: "striped summary-table"
  }, [_c('tbody', [(_vm.gpSireData.imported.regNo) ? [_c('tr', [_c('td', [_vm._v(" Registration Number ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.imported.regNo) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm Of Origin ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.imported.farmOfOrigin) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Country of Origin ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.imported.countryOfOrigin) + " ")])])] : [(_vm.gpSireData.existingRegNo) ? [_c('tr', [_c('td', [_vm._v(" Registration Number ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.existingRegNo) + " ")])])] : _vm._e(), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Genetic Information ID (optional) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.geneticInfoId) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm Of Origin ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.transformFarmId(_vm.gpSireData.farmFromId)) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm Swine ID / Earmark ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.farmSwineId) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Number of Teats ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.teatNo) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Date ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.birthDate) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Weight ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.birthWeight) + " kg")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Parity ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.parity) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (M) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.littersizeAliveMale) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (F) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.littersizeAliveFemale) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Littersize at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.littersizeWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total litterweight at weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.litterweightWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.dateWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Adjusted ADG from Birth (180 days) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireComputedAdgFromBirth) + " kg/day")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Adjusted ADG on Test (90-150 days) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireComputedAdgOnTest) + " kg/day")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Feed Efficiency ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireComputedFeedEfficiency) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Backfat Thickness (BFT) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.bft) + " mm")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date of BFT Collection ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSireData.bftCollected) + " ")])])]], 2)])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 m12 l6",
    attrs: {
      "id": "gp-dam-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('h6', {
    staticClass: "center-align"
  }, [(_vm.gpDamData.existingRegNo) ? [_c('b', [_vm._v("\n                                        GP Dam Information\n                                        (Registered)\n                                    ")])] : (_vm.gpDamData.imported.regNo) ? [_c('b', [_vm._v("\n                                        GP Dam Information\n                                        (Imported)\n                                    ")])] : [_c('b', [_vm._v("\n                                        GP Dam Information\n                                        (New)\n                                    ")])]], 2), _vm._v(" "), _vm._m(4), _vm._v(" "), _c('table', {
    staticClass: "striped summary-table"
  }, [_c('tbody', [(_vm.gpDamData.imported.regNo) ? [_c('tr', [_c('td', [_vm._v(" Registration Number ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.imported.regNo) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm of Origin ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.imported.farmOfOrigin) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Country of Origin ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.imported.countryOfOrigin) + " ")])])] : [(_vm.gpDamData.existingRegNo) ? [_c('tr', [_c('td', [_vm._v(" Registration Number ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.existingRegNo) + " ")])])] : _vm._e(), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Genetic Information ID (optional) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.geneticInfoId) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm Of Origin ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.transformFarmId(_vm.gpDamData.farmFromId)) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm Swine ID / Earmark ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.farmSwineId) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Number of Teats ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.teatNo) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Date ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.birthDate) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Weight ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.birthWeight) + " kg")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Parity ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.parity) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (M) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.littersizeAliveMale) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (F) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.littersizeAliveFemale) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Littersize at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.littersizeWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total litterweight at weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.litterweightWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.dateWeaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Adjusted ADG from Birth (180 days) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamComputedAdgFromBirth) + " kg/day")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Adjusted ADG on Test (90-150 days) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamComputedAdgOnTest) + " kg/day")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Feed Efficiency ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamComputedFeedEfficiency) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Backfat Thickness (BFT) ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.bft) + " mm")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date of BFT Collection ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDamData.bftCollected) + " ")])])]], 2)])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 m12 l6 offset-l3",
    attrs: {
      "id": "swinecart-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(5), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOneSwinecart),
      expression: "gpOneSwinecart"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "check-swinecart"
    },
    domProps: {
      "checked": Array.isArray(_vm.gpOneSwinecart) ? _vm._i(_vm.gpOneSwinecart, null) > -1 : (_vm.gpOneSwinecart)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.gpOneSwinecart,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.gpOneSwinecart = $$a.concat([$$v]))
          } else {
            $$i > -1 && (_vm.gpOneSwinecart = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.gpOneSwinecart = $$c
        }
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "check-swinecart"
    }
  }, [_vm._v("Include this swine in SwineCart?")])])])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "card-action center-align",
    attrs: {
      "id": "summary-card-action"
    }
  }, [(!_vm.successfullyRegistered) ? _c('a', {
    staticClass: "btn-flat waves-effect waves-light preview-cert black-text",
    attrs: {
      "href": _vm.tempRegistryCertificateLink,
      "target": "_blank",
      "name": "action"
    }
  }, [_vm._v("\n                Preview Certificate\n            ")]) : _vm._e(), _vm._v(" "), (!_vm.successfullyRegistered) ? _c('button', {
    staticClass: "btn waves-effect waves-light register-and-generate-cert",
    attrs: {
      "href": "#!",
      "type": "submit",
      "name": "action"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.registerSwine($event)
      }
    }
  }, [_vm._v("\n                Register Swine and Generate Certificate\n            ")]) : _vm._e(), _vm._v(" "), (_vm.successfullyRegistered) ? _c('a', {
    staticClass: "btn-flat waves-effect waves-light view-generated-cert black-text",
    attrs: {
      "href": _vm.registryCertificateLink,
      "target": "_blank",
      "name": "action"
    }
  }, [_vm._v("\n                View Generated Certificate\n            ")]) : _vm._e(), _vm._v(" "), (_vm.successfullyRegistered) ? _c('a', {
    staticClass: "btn waves-effect waves-light",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.triggerGoToTabEvent('photos')
      }
    }
  }, [_vm._v("\n                Upload Swine Photos\n            ")]) : _vm._e()])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v(" Swine Information ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("SwineCart")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4aec38b4", module.exports)
  }
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(109)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(111),
  /* template */
  __webpack_require__(117),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-5bf32331",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterSwineUploadPhoto.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterSwineUploadPhoto.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5bf32331", Component.options)
  } else {
    hotAPI.reload("data-v-5bf32331", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(110);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("d3795bfc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bf32331\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineUploadPhoto.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bf32331\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineUploadPhoto.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n#photos > .card[data-v-5bf32331] {\n    padding: 0;\n}\n#photos-card-action[data-v-5bf32331] {\n    border-top: 0;\n    background-color: rgba(236, 239, 241, 0.7);\n}\n#uploaded-photos-container[data-v-5bf32331] {\n    margin-top: 3rem;\n}\n\n", ""]);

// exports


/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RegisterSwineUploadPhotoDropzone_vue__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RegisterSwineUploadPhotoDropzone_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__RegisterSwineUploadPhotoDropzone_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        swineId: Number,
        uploadurl: String
    },

    components: {
        RegisterSwineUploadPhotoDropzone: __WEBPACK_IMPORTED_MODULE_0__RegisterSwineUploadPhotoDropzone_vue___default.a
    },

    computed: {
        imageFiles: function imageFiles() {
            return this.$store.getters.imageFiles;
        },
        gpOneRegistrationNo: function gpOneRegistrationNo() {
            return this.$store.state.registerSwine.gpOne.regNo;
        }
    },

    methods: {
        addPhotoToImageFiles: function addPhotoToImageFiles(imageDetails) {
            // Put information of uploaded photos in vuex state
            this.$store.commit('addToImageFiles', {
                imageDetails: imageDetails.data,
                orientation: imageDetails.orientation
            });
        },
        removePhotoFromImageFiles: function removePhotoFromImageFiles(imageDetails) {
            // Remove photo from vuex state
            this.$store.commit('removeFromImageFiles', {
                orientation: imageDetails.orientation
            });
        },
        savePhotos: function savePhotos(event) {
            var sidePhoto = this.imageFiles.side;

            // Check if there is a side photo
            if (!_.isEmpty(sidePhoto)) {
                var savePhotosButton = $('.save-photos-button');

                this.disableButtons(savePhotosButton, event.target, 'Saving...');
                Materialize.toast('Photos saved.', 1500, 'green lighten-1');

                // Remove onbeforeunload event
                window.onbeforeunload = null;

                // Reload page
                setTimeout(function () {
                    window.location.reload();
                }, 1600);
            } else {
                Materialize.toast('Photo in side view orientation is required.', 3500, 'orange darken-1');
            }
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(113)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(115),
  /* template */
  __webpack_require__(116),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-babde828",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterSwineUploadPhotoDropzone.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterSwineUploadPhotoDropzone.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-babde828", Component.options)
  } else {
    hotAPI.reload("data-v-babde828", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(114);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("1c04ba02", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-babde828\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineUploadPhotoDropzone.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-babde828\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineUploadPhotoDropzone.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "/* Custom style from vue-dropzone */\n.vue-dropzone[data-v-babde828] {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  min-height: 20rem;\n  border: 2px solid #000000;\n  font-family: inherit;\n  letter-spacing: 0.2px;\n  color: #777;\n  transition: background-color .2s linear;\n}\n.vue-dropzone[data-v-babde828]:hover {\n    background-color: #F6F6F6;\n}\n.vue-dropzone i[data-v-babde828] {\n    color: #CCC;\n}\n.vue-dropzone .dz-preview .dz-image[data-v-babde828] {\n    border-radius: 1;\n}\n.vue-dropzone .dz-preview .dz-image:hover img[data-v-babde828] {\n      transform: none;\n      filter: none;\n      -webkit-filter: none;\n}\n.vue-dropzone .dz-preview .dz-details[data-v-babde828] {\n    bottom: 0;\n    top: 0;\n    color: white;\n    background-color: rgba(33, 150, 243, 0.8);\n    transition: opacity .2s linear;\n    text-align: left;\n}\n.vue-dropzone .dz-preview .dz-details .dz-filename span[data-v-babde828], .vue-dropzone .dz-preview .dz-details .dz-size span[data-v-babde828] {\n      background-color: transparent;\n}\n.vue-dropzone .dz-preview .dz-details .dz-filename:not(:hover) span[data-v-babde828] {\n      border: none;\n}\n.vue-dropzone .dz-preview .dz-details .dz-filename:hover span[data-v-babde828] {\n      background-color: transparent;\n      border: none;\n}\n.vue-dropzone .dz-preview .dz-progress .dz-upload[data-v-babde828] {\n    background: #cccccc;\n}\n.vue-dropzone .dz-preview .dz-remove[data-v-babde828] {\n    position: absolute;\n    z-index: 30;\n    color: white;\n    margin-left: 15px;\n    padding: 10px;\n    top: inherit;\n    bottom: 15px;\n    border: 2px white solid;\n    text-decoration: none;\n    text-transform: uppercase;\n    font-size: 0.8rem;\n    font-weight: 800;\n    letter-spacing: 1.1px;\n    opacity: 0;\n}\n.vue-dropzone .dz-preview:hover .dz-remove[data-v-babde828] {\n    opacity: 1;\n}\n.vue-dropzone .dz-preview .dz-success-mark[data-v-babde828], .vue-dropzone .dz-preview .dz-error-mark[data-v-babde828] {\n    margin-left: auto !important;\n    margin-top: auto !important;\n    width: 100% !important;\n    top: 35% !important;\n    left: 0;\n}\n.vue-dropzone .dz-preview .dz-success-mark i[data-v-babde828], .vue-dropzone .dz-preview .dz-error-mark i[data-v-babde828] {\n      color: white !important;\n      font-size: 5rem !important;\n}\n", ""]);

// exports


/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue2_dropzone__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue2_dropzone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue2_dropzone__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        dropzoneId: String,
        orientation: String,
        swineId: Number,
        uploadurl: String
    },

    components: {
        Dropzone: __WEBPACK_IMPORTED_MODULE_0_vue2_dropzone___default.a
    },

    data: function data() {
        return {
            customOptions: {
                language: {
                    dictDefaultMessage: '<br/> Drop image here to upload'
                },
                parallelUploads: 1,
                maxNumberOfFiles: 1,
                maxFileSizeInMB: 50,
                acceptedFileTypes: 'image/png, image/jpeg, image/jpg, image/tiff, image/heif, image/heic'
            }
        };
    },


    computed: {
        csrfToken: function csrfToken() {
            return document.head.querySelector('meta[name="csrf-token"]').content;
        },
        csrfHeader: function csrfHeader() {
            return {
                'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
            };
        }
    },

    methods: {
        renameFile: function renameFile(file, response) {
            var previewElement = file.previewElement;
            var imageDetails = response;

            // setAttribute is for photo id purposes. Chose not to put it
            // into vue local data storage for ease of use in
            // fetching id upon removal of file
            previewElement.setAttribute('data-photo-id', imageDetails.id);
            previewElement.getElementsByClassName('dz-filename')[0].getElementsByTagName('span')[0].innerHTML = imageDetails.name;

            // Trigger addedPhotoEvent
            this.$emit('addedPhotoEvent', {
                data: imageDetails,
                orientation: this.orientation
            });
        },
        removeFile: function removeFile(file, error, xhr) {
            var photoId = file.previewElement.getAttribute('data-photo-id');

            axios.delete('/breeder/manage-swine/photo/' + photoId + '/orientation/' + this.orientation).then(function (response) {}).catch(function (error) {
                console.log(error);
            });

            // Trigger removedPhotoEvent
            this.$emit('removedPhotoEvent', {
                orientation: this.orientation
            });
        },
        template: function template() {
            return '\n                <div class="dz-preview dz-file-preview">\n                    <div class="dz-image" style="width: 200px;height: 200px">\n                        <img data-dz-thumbnail />\n                    </div>\n                    <div class="dz-details">\n                        <div class="dz-size"><span data-dz-size></span></div>\n                        <div class="dz-filename"><span data-dz-name></span></div>\n                    </div>\n                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n                    <div class="dz-error-message"><span data-dz-errormessage></span></div>\n                    <div class="dz-success-mark"><i class="fa fa-check"></i></div>\n                    <div class="dz-error-mark"><i class="fa fa-close"></i></div>\n                </div>\n            ';
        }
    }
});

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('dropzone', {
    ref: _vm.dropzoneId,
    attrs: {
      "id": _vm.dropzoneId,
      "url": _vm.uploadurl,
      "headers": _vm.csrfHeader,
      "use-custom-dropzone-options": true,
      "dropzone-options": _vm.customOptions
    },
    on: {
      "vdropzone-success": _vm.renameFile,
      "vdropzone-removed-file": _vm.removeFile
    }
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "swineId"
    },
    domProps: {
      "value": _vm.swineId
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "orientation"
    },
    domProps: {
      "value": _vm.orientation
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "token"
    },
    domProps: {
      "value": _vm.csrfToken
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-babde828", module.exports)
  }
}

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row",
    attrs: {
      "id": "photos"
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v("Upload Photos")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('h5', [_vm._v(_vm._s(_vm.gpOneRegistrationNo))]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('br'), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s6 m6 l3"
  }, [_vm._m(1), _vm._v(" "), _c('register-swine-upload-photo-dropzone', {
    attrs: {
      "dropzoneId": 'uploadSidePhotoDropzone',
      "orientation": 'side',
      "swineId": _vm.swineId,
      "uploadurl": _vm.uploadurl
    },
    on: {
      "addedPhotoEvent": _vm.addPhotoToImageFiles,
      "removedPhotoEvent": _vm.removePhotoFromImageFiles
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 m6 l3"
  }, [_vm._m(2), _vm._v(" "), _c('register-swine-upload-photo-dropzone', {
    attrs: {
      "dropzoneId": 'uploadFrontPhotoDropzone',
      "orientation": 'front',
      "swineId": _vm.swineId,
      "uploadurl": _vm.uploadurl
    },
    on: {
      "addedPhotoEvent": _vm.addPhotoToImageFiles,
      "removedPhotoEvent": _vm.removePhotoFromImageFiles
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 m6 l3"
  }, [_vm._m(3), _vm._v(" "), _c('register-swine-upload-photo-dropzone', {
    attrs: {
      "dropzoneId": 'uploadBackPhotoDropzone',
      "orientation": 'back',
      "swineId": _vm.swineId,
      "uploadurl": _vm.uploadurl
    },
    on: {
      "addedPhotoEvent": _vm.addPhotoToImageFiles,
      "removedPhotoEvent": _vm.removePhotoFromImageFiles
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 m6 l3"
  }, [_vm._m(4), _vm._v(" "), _c('register-swine-upload-photo-dropzone', {
    attrs: {
      "dropzoneId": 'uploadTopPhotoDropzone',
      "orientation": 'top',
      "swineId": _vm.swineId,
      "uploadurl": _vm.uploadurl
    },
    on: {
      "addedPhotoEvent": _vm.addPhotoToImageFiles,
      "removedPhotoEvent": _vm.removePhotoFromImageFiles
    }
  })], 1), _vm._v(" "), _vm._m(5)])]), _vm._v(" "), _c('div', {
    staticClass: "card-action center-align",
    attrs: {
      "id": "photos-card-action"
    }
  }, [_c('button', {
    staticClass: "btn waves-effect waves-light save-photos-button",
    attrs: {
      "href": "#!",
      "type": "submit",
      "name": "action"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.savePhotos($event)
      }
    }
  }, [_vm._v("\n                Save Photos\n            ")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('blockquote', {
    staticClass: "info"
  }, [_vm._v("\n                Please upload good quality images with recommended\n                "), _c('b', [_vm._v("side")]), _vm._v(", "), _c('b', [_vm._v("front")]), _vm._v(", "), _c('b', [_vm._v("back")]), _vm._v(", and "), _c('b', [_vm._v("top")]), _vm._v(" orientations. "), _c('br'), _vm._v("\n                Recommended image file formats are "), _c('b', [_vm._v("JPEG")]), _vm._v(" and "), _c('b', [_vm._v("PNG")]), _vm._v(".\n            ")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("Side View *")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("Front View")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("Back View")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("Top View")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('p', [_c('br'), _vm._v("\n                        * Photo in side view orientation is required.\n                    ")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5bf32331", module.exports)
  }
}

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s10 offset-s1"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "row",
    staticStyle: {
      "margin-bottom": "0"
    }
  }, [_c('div', {
    staticClass: "col s12",
    staticStyle: {
      "margin-top": "2rem",
      "padding": "0"
    },
    attrs: {
      "id": "add-swine-tabs"
    }
  }, [_c('ul', {
    staticClass: "tabs tabs-fixed-width z-depth-2"
  }, [_vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('li', {
    staticClass: "tab col s2",
    class: {
      'disabled': _vm.tabDisables.summary
    }
  }, [_c('a', {
    attrs: {
      "href": "#summary"
    }
  }, [_vm._v("Summary")])]), _vm._v(" "), _c('li', {
    staticClass: "tab col s2",
    class: {
      'disabled': _vm.tabDisables.photos
    }
  }, [_c('a', {
    attrs: {
      "href": "#photos"
    }
  }, [_vm._v("Photos")])])])])]), _vm._v(" "), _c('div', {
    staticClass: "row",
    attrs: {
      "id": "basic-information"
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v("Basic Information")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12 m6 l4 offset-m3 offset-l4"
  }, [_vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Breed",
      "options": _vm.breeds
    },
    on: {
      "select": function (val) {
        _vm.gpOneBreedId = val
      }
    },
    model: {
      value: (_vm.gpOneBreedId),
      callback: function($$v) {
        _vm.gpOneBreedId = $$v
      },
      expression: "gpOneBreedId"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Sex",
      "options": [{
        text: 'Male',
        value: 'male'
      }, {
        text: 'Female',
        value: 'female'
      }]
    },
    on: {
      "select": function (val) {
        _vm.gpOneSex = val
      }
    },
    model: {
      value: (_vm.gpOneSex),
      callback: function($$v) {
        _vm.gpOneSex = $$v
      },
      expression: "gpOneSex"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOneBirthDate = val
      }
    },
    model: {
      value: (_vm.gpOneBirthDate),
      callback: function($$v) {
        _vm.gpOneBirthDate = $$v
      },
      expression: "gpOneBirthDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Birth Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Farm Of Origin",
      "options": _vm.farmoptions
    },
    on: {
      "select": function (val) {
        _vm.gpOneFarmFromId = val
      }
    },
    model: {
      value: (_vm.gpOneFarmFromId),
      callback: function($$v) {
        _vm.gpOneFarmFromId = $$v
      },
      expression: "gpOneFarmFromId"
    }
  })], 1), _vm._v(" "), _vm._m(5)]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light blue right",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.goToTab('gp-1')
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("arrow_forward")])])])])])])]), _vm._v(" "), _c('register-swine-properties', {
    on: {
      "goToTabEvent": _vm.goToTab
    }
  }), _vm._v(" "), _c('register-swine-parents-properties', {
    attrs: {
      "farmoptions": _vm.farmoptions
    },
    on: {
      "goToTabEvent": _vm.goToTab
    }
  }), _vm._v(" "), _c('register-swine-summary', {
    attrs: {
      "breeds": _vm.breeds,
      "farmoptions": _vm.farmoptions
    },
    on: {
      "goToTabEvent": _vm.goToTab
    }
  }), _vm._v(" "), _c('register-swine-upload-photo', {
    attrs: {
      "swineId": _vm.gpOneId,
      "uploadurl": _vm.uploadurl
    }
  })], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" Register Swine ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "tab col s3"
  }, [_c('a', {
    attrs: {
      "href": "#basic-information"
    }
  }, [_vm._v("Basic Information")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "tab col s2"
  }, [_c('a', {
    attrs: {
      "href": "#gp-1"
    }
  }, [_vm._v("GP1")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "tab col s3"
  }, [_c('a', {
    attrs: {
      "href": "#gp-parents"
    }
  }, [_vm._v("GP Parents")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ee7fd1e0", module.exports)
  }
}

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(120)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(122),
  /* template */
  __webpack_require__(123),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ViewRegisteredSwine.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ViewRegisteredSwine.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-181327ec", Component.options)
  } else {
    hotAPI.reload("data-v-181327ec", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(121);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("6f86576b", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-181327ec\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ViewRegisteredSwine.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-181327ec\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ViewRegisteredSwine.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\ndiv#options-container {\n    margin-top: 2rem;\n    margin-bottom: 1rem;\n}\ndiv#view-icons-container {\n    cursor: pointer;\n}\ndiv#empty-swine-container {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n}\nspan#view-label {\n    margin-right: 1rem;\n}\n.custom-secondary-btn {\n    border: 1px solid;\n    background-color: white !important;\n}\na#list-swinecart-icon {\n    margin-right: 2rem;\n}\n\n/* Collapsible customizations */\ndiv.collapsible-body {\n    background-color: rgba(255, 255, 255, 0.7);\n}\np.range-field {\n    margin: 0;\n}\np.range-field label {\n    color: black;\n}\n\n/* Card customizations */\n.card-image {\n    background-color: white;\n}\n.card-image img {\n    margin: 0 auto;\n\twidth: auto;\n\tpadding: 0.5rem;\n}\n.card-action a {\n    margin-top: 0.5rem;\n    margin-bottom: 0.5rem;\n}\n\n/* Search component overrides */\n.input-field label[for='search'] {\n    font-size: inherit;\n    -webkit-transform: none;\n    -moz-transform: none;\n    -ms-transform: none;\n    -o-transform: none;\n    transform: none;\n}\ninput#search {\n    color: black;\n}\n\n/* Medium Screen */\n@media only screen and (min-width: 601px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 160px;\n}\n}\n\n/* Large Screen */\n@media only screen and (min-width: 993px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 168px;\n}\n}\n\n/* Extra Large Screen */\n@media only screen and (min-width: 1100px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 180px;\n}\n}\n\n/* Super Extra Large Screen */\n@media only screen and (min-width: 1560px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 210px;\n}\n}\n\n/* Super Super Extra Large Screen */\n@media only screen and (min-width: 1560px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 270px;\n}\n}\n", ""]);

// exports


/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        breeds: Array,
        currentFilterOptions: Object,
        farmoptions: Array,
        currentSearchParameter: String,
        swines: Array,
        viewUrl: String
    },

    data: function data() {
        return {
            swinePhotosDirectory: '/storage/images/swine/',
            viewLayout: 'card',
            pageNumber: 0,
            paginationSize: 15,
            filterOptions: this.currentFilterOptions,
            searchParameter: this.currentSearchParameter,
            viewPhotosModal: {
                registrationNo: '',
                photos: []
            }
        };
    },


    computed: {
        pageCount: function pageCount() {
            var l = this.swines.length;
            var s = this.paginationSize;

            return Math.ceil(l / s);
        },
        paginatedSwines: function paginatedSwines() {
            var start = this.pageNumber * this.paginationSize;
            var end = start + this.paginationSize;

            return _.sortBy(this.swines, ['registration_no']).slice(start, end);
        }
    },

    watch: {
        filterOptions: {
            handler: function handler(oldValue, newValue) {
                // Watch filterOptions object for url rewrite
                this.rewriteUrl(newValue, this.searchParameter);
            },
            deep: true
        }
    },

    methods: {
        previousPage: function previousPage() {
            if (this.pageNumber !== 0) this.pageNumber--;
        },
        nextPage: function nextPage() {
            if (this.pageNumber < this.pageCount - 1) this.pageNumber++;
        },
        goToPage: function goToPage(page) {
            this.pageNumber = page - 1;
        },
        getIndex: function getIndex(id, arrayToBeSearched) {
            // Return index of object to find
            for (var i = 0; i < arrayToBeSearched.length; i++) {
                if (arrayToBeSearched[i].id === id) return i;
            }
        },
        rewriteUrl: function rewriteUrl(filterOptions, searchParameter) {
            /**
             *  URL rewrite syntax: 
             *  ?q=value*
             *  &breed=value[+value]*
             *  &sex=value[+value]
             *  &farm=value[+value]*
             *  &sc=[0|1]
             */
            var url = this.viewUrl;
            var parameters = [];

            // Put search parameter in parameters if it is non-empty
            if (searchParameter.length > 0) {
                var qParameter = 'q=' + searchParameter;

                parameters.push(qParameter);
            }

            // Put breed parameter in parameters if filter is chosen
            if (filterOptions.breed.length > 0) {
                var breedParameter = 'breed=';
                breedParameter += filterOptions.breed.join('+');

                parameters.push(breedParameter);
            }

            // Put sex parameter in parameters if filter is chosen
            if (filterOptions.sex.length > 0) {
                var sexParameter = 'sex=';
                sexParameter += filterOptions.sex.join('+');

                parameters.push(sexParameter);
            }

            // Put farm parameter in parameters if filter is chosen
            if (filterOptions.farm.length > 0) {
                var farmParameter = 'farm=';
                farmParameter += filterOptions.farm.join('+');

                parameters.push(farmParameter);
            }

            // Put swineCart parameter in parameters if filter is chosen
            if (filterOptions.sc) {
                var swineCartParameter = 'sc=' + filterOptions.sc;

                parameters.push(swineCartParameter);
            }

            // Redirect to new url
            if (parameters.length > 0) window.location = url + '?' + parameters.join('&');else window.location = url;
        },
        viewPhotos: function viewPhotos(swineId) {
            // Prepare needed data for modal
            var index = this.getIndex(swineId, this.swines);
            var swine = this.swines[index];

            this.viewPhotosModal.registrationNo = swine.registration_no;
            this.viewPhotosModal.photos = swine.photos;

            $('#view-photos-modal').modal('open');
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
});

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "col s4 m3 l2"
  }, [_c('ul', {
    staticClass: "collapsible",
    attrs: {
      "data-collapsible": "expandable"
    }
  }, [_c('li', [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('p', {
    staticClass: "range-field"
  }, [_vm._l((_vm.breeds), function(breed) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.filterOptions.breed),
        expression: "filterOptions.breed"
      }],
      staticClass: "filled-in",
      attrs: {
        "type": "checkbox",
        "id": breed.text
      },
      domProps: {
        "value": breed.value,
        "checked": Array.isArray(_vm.filterOptions.breed) ? _vm._i(_vm.filterOptions.breed, breed.value) > -1 : (_vm.filterOptions.breed)
      },
      on: {
        "change": function($event) {
          var $$a = _vm.filterOptions.breed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = breed.value,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (_vm.$set(_vm.filterOptions, "breed", $$a.concat([$$v])))
            } else {
              $$i > -1 && (_vm.$set(_vm.filterOptions, "breed", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
            }
          } else {
            _vm.$set(_vm.filterOptions, "breed", $$c)
          }
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": breed.text
      }
    }, [_vm._v(" " + _vm._s(breed.text) + " ")]), _vm._v(" "), _c('br')]
  })], 2)])]), _vm._v(" "), _c('li', [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('p', {
    staticClass: "range-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.filterOptions.sex),
      expression: "filterOptions.sex"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "male",
      "value": "male"
    },
    domProps: {
      "checked": Array.isArray(_vm.filterOptions.sex) ? _vm._i(_vm.filterOptions.sex, "male") > -1 : (_vm.filterOptions.sex)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.filterOptions.sex,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = "male",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.filterOptions, "sex", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.filterOptions, "sex", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.filterOptions, "sex", $$c)
        }
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "male"
    }
  }, [_vm._v("Male")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.filterOptions.sex),
      expression: "filterOptions.sex"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "female",
      "value": "female"
    },
    domProps: {
      "checked": Array.isArray(_vm.filterOptions.sex) ? _vm._i(_vm.filterOptions.sex, "female") > -1 : (_vm.filterOptions.sex)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.filterOptions.sex,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = "female",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.filterOptions, "sex", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.filterOptions, "sex", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.filterOptions, "sex", $$c)
        }
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "female"
    }
  }, [_vm._v("Female")])])])]), _vm._v(" "), _c('li', [_vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('p', {
    staticClass: "range-field"
  }, [_vm._l((_vm.farmoptions), function(farm) {
    return [_c('div', [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.filterOptions.farm),
        expression: "filterOptions.farm"
      }],
      staticClass: "filled-in",
      attrs: {
        "type": "checkbox",
        "id": farm.text
      },
      domProps: {
        "value": farm.value,
        "checked": Array.isArray(_vm.filterOptions.farm) ? _vm._i(_vm.filterOptions.farm, farm.value) > -1 : (_vm.filterOptions.farm)
      },
      on: {
        "change": function($event) {
          var $$a = _vm.filterOptions.farm,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = farm.value,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (_vm.$set(_vm.filterOptions, "farm", $$a.concat([$$v])))
            } else {
              $$i > -1 && (_vm.$set(_vm.filterOptions, "farm", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
            }
          } else {
            _vm.$set(_vm.filterOptions, "farm", $$c)
          }
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": farm.text
      }
    }, [_vm._v(" " + _vm._s(farm.text) + " ")])])]
  })], 2)])]), _vm._v(" "), _c('li', [_vm._m(5), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('p', {
    staticClass: "range-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.filterOptions.sc),
      expression: "filterOptions.sc"
    }],
    staticClass: "filled-in",
    attrs: {
      "true-value": "1",
      "false-value": "0",
      "type": "checkbox",
      "id": "swinecart"
    },
    domProps: {
      "checked": Array.isArray(_vm.filterOptions.sc) ? _vm._i(_vm.filterOptions.sc, null) > -1 : _vm._q(_vm.filterOptions.sc, "1")
    },
    on: {
      "change": function($event) {
        var $$a = _vm.filterOptions.sc,
          $$el = $event.target,
          $$c = $$el.checked ? ("1") : ("0");
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.filterOptions, "sc", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.filterOptions, "sc", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.filterOptions, "sc", $$c)
        }
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "swinecart"
    }
  }, [_vm._v("Included in SwineCart")])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s8 m9 l10"
  }, [_c('div', {
    staticClass: "col s8 offset-s2"
  }, [_c('nav', {
    attrs: {
      "id": "search-container"
    }
  }, [_c('div', {
    staticClass: "nav-wrapper white",
    attrs: {
      "id": "search-field"
    }
  }, [_c('div', {
    staticStyle: {
      "height": "1px"
    }
  }), _vm._v(" "), _c('form', {
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.rewriteUrl(_vm.filterOptions, _vm.searchParameter)
      }
    }
  }, [_c('div', {
    staticClass: "input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.searchParameter),
      expression: "searchParameter"
    }],
    attrs: {
      "id": "search",
      "name": "q",
      "type": "search",
      "placeholder": "Type swine registration no. and press enter to search",
      "autocomplete": "off"
    },
    domProps: {
      "value": (_vm.searchParameter)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.searchParameter = $event.target.value
      }
    }
  }), _vm._v(" "), _vm._m(6), _vm._v(" "), _c('i', {
    staticClass: "material-icons"
  }, [_vm._v("close")])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12",
    attrs: {
      "id": "options-container"
    }
  }, [_vm._m(7), _vm._v(" "), _c('div', {
    staticClass: "left",
    attrs: {
      "id": "view-icons-container"
    }
  }, [_c('i', {
    staticClass: "material-icons tooltipped",
    class: _vm.viewLayout === 'card' ? 'blue-text' : 'grey-text',
    attrs: {
      "data-position": "top",
      "data-delay": "50",
      "data-tooltip": "Card"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.viewLayout = 'card'
      }
    }
  }, [_vm._v("\n                    view_module\n                ")]), _vm._v(" "), _c('i', {
    staticClass: "material-icons tooltipped",
    class: _vm.viewLayout === 'list' ? 'blue-text' : 'grey-text',
    attrs: {
      "data-position": "top",
      "data-delay": "50",
      "data-tooltip": "List"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.viewLayout = 'list'
      }
    }
  }, [_vm._v("\n                    view_list\n                ")])])]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "card-layout-container"
    }
  }, _vm._l((_vm.paginatedSwines), function(swine, index) {
    return _c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.viewLayout === 'card'),
        expression: "viewLayout === 'card'"
      }],
      key: swine.id,
      staticClass: "col s12 m6 l4"
    }, [_c('div', {
      staticClass: "card"
    }, [_c('div', {
      staticClass: "card-image"
    }, [_c('img', {
      staticClass: "materialboxed",
      attrs: {
        "src": _vm.swinePhotosDirectory + swine.photos[0].name
      }
    }), _vm._v(" "), (swine.swinecart) ? _c('a', {
      staticClass: "btn-floating halfway-fab red lighten-1 tooltipped",
      attrs: {
        "data-position": "top",
        "data-delay": "50",
        "data-tooltip": "Included in SwineCart"
      }
    }, [_c('i', {
      staticClass: "material-icons"
    }, [_vm._v("shopping_cart")])]) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "card-content"
    }, [_c('span', {
      staticClass: "card-title flow-text"
    }, [_c('b', [_vm._v(_vm._s(swine.registration_no))])]), _vm._v(" "), _c('p', {}, [_vm._v("\n                            " + _vm._s(swine.farm.name) + ", " + _vm._s(swine.farm.province) + " "), _c('br'), _vm._v("\n                            " + _vm._s(swine.breed.title) + " (" + _vm._s(swine.swine_properties[0].value) + ")\n                        ")])]), _vm._v(" "), _c('div', {
      staticClass: "card-action"
    }, [_c('a', {
      staticClass: "btn blue darken-1 z-depth-0",
      attrs: {
        "href": ("/breeder/registry-certificate/" + (swine.id)),
        "target": "_blank"
      }
    }, [_vm._v("\n                            Certificate\n                        ")]), _vm._v(" "), _c('a', {
      staticClass: "btn custom-secondary-btn blue-text text-darken-1 z-depth-0",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.viewPhotos(swine.id)
        }
      }
    }, [_vm._v("\n                            Photos\n                        ")])])])])
  })), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.viewLayout === 'list'),
      expression: "viewLayout === 'list'"
    }],
    staticClass: "col s12",
    attrs: {
      "id": "list-layout-container"
    }
  }, [_c('ul', {
    staticClass: "collection"
  }, _vm._l((_vm.paginatedSwines), function(swine, index) {
    return _c('li', {
      key: swine.id,
      staticClass: "collection-item avatar"
    }, [_c('img', {
      staticClass: "circle materialboxed",
      attrs: {
        "src": _vm.swinePhotosDirectory + swine.photos[0].name,
        "alt": ""
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "title"
    }, [_c('b', [_vm._v(_vm._s(swine.registration_no))])]), _vm._v(" "), _c('p', {}, [_vm._v("\n                        " + _vm._s(swine.farm.name) + ", " + _vm._s(swine.farm.province) + " "), _c('br'), _vm._v("\n                        " + _vm._s(swine.breed.title) + " (" + _vm._s(swine.swine_properties[0].value) + ")\n                    ")]), _vm._v(" "), _c('div', {
      staticClass: "secondary-content"
    }, [(swine.swinecart) ? _c('a', {
      staticClass: "btn-floating red lighten-1 z-depth-0 tooltipped",
      attrs: {
        "id": "list-swinecart-icon",
        "data-position": "top",
        "data-delay": "50",
        "data-tooltip": "Included in SwineCart"
      }
    }, [_c('i', {
      staticClass: "material-icons"
    }, [_vm._v("shopping_cart")])]) : _vm._e(), _vm._v(" "), _c('a', {
      staticClass: "btn blue darken-1 z-depth-0",
      attrs: {
        "href": ("/breeder/registry-certificate/" + (swine.id)),
        "target": "_blank"
      }
    }, [_vm._v("\n                            Certificate\n                        ")]), _vm._v(" "), _c('a', {
      staticClass: "btn custom-secondary-btn blue-text text-darken-1 z-depth-0",
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.viewPhotos(swine.id)
        }
      }
    }, [_vm._v("\n                            Photos\n                        ")])])])
  }))]), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.paginatedSwines.length === 0),
      expression: "paginatedSwines.length === 0"
    }],
    staticClass: "col s12 center-align",
    attrs: {
      "id": "empty-swine-container"
    }
  }, [_vm._m(8)]), _vm._v(" "), _c('div', {
    staticClass: "col s12 center-align pagination-container"
  }, [_c('ul', {
    staticClass: "pagination"
  }, [_c('li', {
    class: (_vm.pageNumber === 0) ? 'disabled' : 'waves-effect'
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.previousPage()
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("chevron_left")])])]), _vm._v(" "), _vm._l((_vm.pageCount), function(i) {
    return _c('li', {
      staticClass: "waves-effect",
      class: (i === _vm.pageNumber + 1) ? 'active' : 'waves-effect'
    }, [_c('a', {
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.goToPage(i)
        }
      }
    }, [_vm._v(" " + _vm._s(i) + " ")])])
  }), _vm._v(" "), _c('li', {
    class: (_vm.pageNumber >= _vm.pageCount - 1) ? 'disabled' : 'waves-effect'
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.nextPage()
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("chevron_right")])])])], 2)])]), _vm._v(" "), _c('div', {
    staticClass: "modal bottom-sheet",
    attrs: {
      "id": "view-photos-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_c('h5', [_c('b', [_vm._v(_vm._s(_vm.viewPhotosModal.registrationNo))]), _vm._v("   /   Photos\n                "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, _vm._l((_vm.viewPhotosModal.photos), function(photo) {
    return _c('div', {
      key: photo.id,
      staticClass: "col s4"
    }, [_c('div', {
      staticClass: "card"
    }, [_c('div', {
      staticClass: "card-image"
    }, [_c('img', {
      attrs: {
        "src": _vm.swinePhotosDirectory + photo.name
      }
    })])])])
  }))]), _vm._v(" "), _vm._m(9)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" View Registered Swine ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('p', [_c('br')])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "collapsible-header active"
  }, [_c('b', [_vm._v("Breed")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "collapsible-header active"
  }, [_c('b', [_vm._v("Sex")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "collapsible-header active"
  }, [_c('b', [_vm._v("Farm")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "collapsible-header active"
  }, [_c('b', [_vm._v("SwineCart")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "label-icon",
    attrs: {
      "for": "search"
    }
  }, [_c('i', {
    staticClass: "material-icons teal-text"
  }, [_vm._v("search")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "left"
  }, [_c('span', {
    attrs: {
      "id": "view-label"
    }
  }, [_vm._v("\n                    VIEW\n                ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('b', [_vm._v("Sorry, no swine found.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal-footer"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect waves-green btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-181327ec", module.exports)
  }
}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(125)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(127),
  /* template */
  __webpack_require__(128),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-091d2757",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisterLaboratoryResults.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisterLaboratoryResults.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-091d2757", Component.options)
  } else {
    hotAPI.reload("data-v-091d2757", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(126);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("7f966660", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-091d2757\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterLaboratoryResults.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-091d2757\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterLaboratoryResults.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\np.padded[data-v-091d2757] {\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n}\np.padded label[data-v-091d2757] {\n    padding-right: 2rem;\n}\n\n/* Card Customizations */\n.card[data-v-091d2757] {\n    padding: 0;\n}\n.card-traits-container[data-v-091d2757] {\n    padding-bottom: 1rem;\n}\ndiv.card-action[data-v-091d2757] {\n    border-top: 0;\n    background-color: rgba(236, 239, 241, 0.7);\n}\n\n/* Accent highlights on cards */\n#fertility-container > .card[data-v-091d2757] {\n    border-top: 4px solid #2672a6;\n}\n#meat-and-growth-container > .card[data-v-091d2757] {\n    border-top: 4px solid #26a69a;\n}\n#defects-container > .card[data-v-091d2757] {\n    border-top: 4px solid #9a26a6;\n}\n#diseases-container > .card[data-v-091d2757] {\n    border-top: 4px solid #a69a26;\n}\n\n", ""]);

// exports


/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        farmoptions: Array
    },

    data: function data() {
        return {
            successfullyRegistered: false,
            showChoices: {
                farm: 'registered',
                esr: false,
                prlr: false,
                rbp4: false,
                lif: false,
                hfabp: false,
                igf2: false,
                lepr: false,
                myog: false,
                pss: false,
                rn: false,
                bax: false,
                fut1: false,
                mx1: false,
                nramp: false,
                bpi: false
            },
            testChoices: {
                esr: ['BB', 'Bb', 'bb'],
                prlr: ['AA', 'Aa', 'aa'],
                rbp4: ['BB', 'Bb', 'bb'],
                lif: ['BB', 'Bb', 'bb'],
                hfabp: ['AA', 'Aa', 'aa'],
                igf2: ['CC', 'Cc', 'cc'],
                lepr: ['BB', 'Bb', 'bb'],
                myog: ['AA', 'Aa', 'aa'],
                pss: ['Positive', 'Negative'],
                rn: ['Positive', 'Negative'],
                bax: ['Positive', 'Negative'],
                fut1: ['AA', 'Aa', 'aa'],
                mx1: ['Resistant', 'Non-resistant'],
                nramp: ['BB', 'Bb', 'bb'],
                bpi: ['GG', 'Gg', 'gg']

            },
            recordInfoData: {
                laboratoryResultNo: '',
                animalId: '',
                sex: '',
                farmId: '',
                farmName: '',
                dateResult: '',
                dateSubmitted: '',
                tests: {
                    esr: '',
                    prlr: '',
                    rbp4: '',
                    lif: '',
                    hfabp: '',
                    igf2: '',
                    lepr: '',
                    myog: '',
                    pss: '',
                    rn: '',
                    bax: '',
                    fut1: '',
                    mx1: '',
                    nramp: '',
                    bpi: ''
                }
            }
        };
    },


    computed: {
        tempPdfLink: function tempPdfLink() {
            return '/genomics/temp-pdf-lab-results';
        }
    },

    watch: {
        // Check if test is not chosen/shown anymore
        // then reset value of test to default
        'showChoices.esr': function showChoicesEsr(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.esr = '';
        },
        'showChoices.prlr': function showChoicesPrlr(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.prlr = '';
        },
        'showChoices.rbp4': function showChoicesRbp4(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.rbp4 = '';
        },
        'showChoices.lif': function showChoicesLif(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.lif = '';
        },
        'showChoices.hfabp': function showChoicesHfabp(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.hfabp = '';
        },
        'showChoices.igf2': function showChoicesIgf2(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.igf2 = '';
        },
        'showChoices.lepr': function showChoicesLepr(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.lepr = '';
        },
        'showChoices.myog': function showChoicesMyog(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.myog = '';
        },
        'showChoices.pss': function showChoicesPss(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.pss = '';
        },
        'showChoices.rn': function showChoicesRn(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.rn = '';
        },
        'showChoices.bax': function showChoicesBax(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.bax = '';
        },
        'showChoices.fut1': function showChoicesFut1(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.fut1 = '';
        },
        'showChoices.mx1': function showChoicesMx1(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.mx1 = '';
        },
        'showChoices.nramp': function showChoicesNramp(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.nramp = '';
        },
        'showChoices.bpi': function showChoicesBpi(oldValue, newValue) {
            if (oldValue === false) this.recordInfoData.tests.bpi = '';
        }
    },

    methods: {
        goToTab: function goToTab(tabId) {
            this.$nextTick(function () {
                $('#add-lab-result-tabs ul.tabs').tabs('select_tab', tabId);
                // Scroll animation
                $('html, body').animate({
                    scrollTop: $('#add-lab-result-tabs').offset().top - 70 + "px"
                }, 500);
            });
        },
        saveLaboratoryResults: function saveLaboratoryResults(event) {
            var _this = this;

            var vm = this;
            var saveLabResultsButton = $('.save-btn');

            this.disableButtons(saveLabResultsButton, event.target, 'Saving...');

            // Add to server's database
            axios.post('/genomics/manage/laboratory-results', vm.recordInfoData).then(function (response) {
                // Reset registering of lab results to default values
                vm.recordInfoData = {
                    laboratoryResultNo: '',
                    animalId: '',
                    sex: '',
                    farmId: '',
                    farmName: '',
                    dateResult: '',
                    dateSubmitted: '',
                    tests: {
                        esr: '',
                        prlr: '',
                        rbp4: '',
                        lif: '',
                        hfabp: '',
                        igf2: '',
                        lepr: '',
                        myog: '',
                        pss: '',
                        rn: '',
                        bax: '',
                        fut1: '',
                        mx1: '',
                        nramp: '',
                        bpi: ''
                    }
                };

                // Update UI after adding breed
                vm.$nextTick(function () {
                    _this.enableButtons(saveLabResultsButton, event.target, 'Save');

                    Materialize.toast('Laboratory Results saved.', 2500, 'green lighten-1');

                    // Reload page
                    setTimeout(function () {
                        window.location.reload();
                    }, 2600);
                });
            }).catch(function (error) {
                console.log(error);
            });
        },
        disableButtons: function disableButtons(buttons, actionBtnElement, textToShow) {
            buttons.addClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        },
        enableButtons: function enableButtons(buttons, actionBtnElement, textToShow) {
            buttons.removeClass('disabled');
            actionBtnElement.innerHTML = textToShow;
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.collapsible').collapsible();
    }
});

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s10 offset-s1"
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "row",
    attrs: {
      "id": "general-information"
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v(" General Information ")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12 m6 l4 offset-m3 offset-l4"
  }, [_vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.recordInfoData.laboratoryResultNo),
      expression: "recordInfoData.laboratoryResultNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": "lab-result-no",
      "type": "text"
    },
    domProps: {
      "value": (_vm.recordInfoData.laboratoryResultNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.recordInfoData, "laboratoryResultNo", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "lab-result-no"
    }
  }, [_vm._v("Laboratory Result No.")])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.recordInfoData.animalId),
      expression: "recordInfoData.animalId"
    }],
    staticClass: "validate",
    attrs: {
      "id": "animal-id",
      "type": "text"
    },
    domProps: {
      "value": (_vm.recordInfoData.animalId)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.recordInfoData, "animalId", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "animal-id"
    }
  }, [_vm._v("Animal ID")])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Sex",
      "options": [{
        text: 'Male',
        value: 'male'
      }, {
        text: 'Female',
        value: 'female'
      }]
    },
    on: {
      "select": function (val) {
        _vm.recordInfoData.sex = val
      }
    },
    model: {
      value: (_vm.recordInfoData.sex),
      callback: function($$v) {
        _vm.$set(_vm.recordInfoData, "sex", $$v)
      },
      expression: "recordInfoData.sex"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.recordInfoData.dateResult = val
      }
    },
    model: {
      value: (_vm.recordInfoData.dateResult),
      callback: function($$v) {
        _vm.$set(_vm.recordInfoData, "dateResult", $$v)
      },
      expression: "recordInfoData.dateResult"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v("Date of Result")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.recordInfoData.dateSubmitted = val
      }
    },
    model: {
      value: (_vm.recordInfoData.dateSubmission),
      callback: function($$v) {
        _vm.$set(_vm.recordInfoData, "dateSubmission", $$v)
      },
      expression: "recordInfoData.dateSubmission"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v("Date Submitted")])], 1), _vm._v(" "), _vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_vm._m(4), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.farm),
      expression: "showChoices.farm"
    }],
    attrs: {
      "name": "yes",
      "type": "radio",
      "id": "yes",
      "value": "registered"
    },
    domProps: {
      "checked": _vm._q(_vm.showChoices.farm, "registered")
    },
    on: {
      "change": function($event) {
        _vm.$set(_vm.showChoices, "farm", "registered")
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "yes"
    }
  }, [_vm._v("Yes")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.farm),
      expression: "showChoices.farm"
    }],
    attrs: {
      "name": "no",
      "type": "radio",
      "id": "no",
      "value": "not-registered"
    },
    domProps: {
      "checked": _vm._q(_vm.showChoices.farm, "not-registered")
    },
    on: {
      "change": function($event) {
        _vm.$set(_vm.showChoices, "farm", "not-registered")
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "no"
    }
  }, [_vm._v("No")])])]), _vm._v(" "), _vm._m(5), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.farm === 'registered'),
      expression: "showChoices.farm === 'registered'"
    }],
    staticClass: "col s12 input-field"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Farm Of Origin",
      "options": _vm.farmoptions
    },
    on: {
      "select": function (val) {
        _vm.recordInfoData.farmId = val
      }
    },
    model: {
      value: (_vm.recordInfoData.farmId),
      callback: function($$v) {
        _vm.$set(_vm.recordInfoData, "farmId", $$v)
      },
      expression: "recordInfoData.farmId"
    }
  })], 1), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.farm === 'not-registered'),
      expression: "showChoices.farm === 'not-registered'"
    }],
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.recordInfoData.farmName),
      expression: "recordInfoData.farmName"
    }],
    staticClass: "validate",
    attrs: {
      "id": "farm-name",
      "type": "text"
    },
    domProps: {
      "value": (_vm.recordInfoData.farmName)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.$set(_vm.recordInfoData, "farmName", $event.target.value)
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "farm-name"
    }
  }, [_vm._v("Farm Name")])]), _vm._v(" "), _vm._m(6)]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('a', {
    staticClass: "btn-floating btn-large waves-effect waves-light blue right",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.goToTab('genetic-information')
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("arrow_forward")])])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "row",
    attrs: {
      "id": "genetic-information"
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v(" Genetic Information ")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_vm._m(7), _vm._v(" "), _c('div', {
    staticClass: "col s12 m6",
    attrs: {
      "id": "fertility-container"
    }
  }, [_c('div', {
    staticClass: "card col s12 card-traits-container"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(8), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.esr),
      expression: "showChoices.esr"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "esr-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.esr) ? _vm._i(_vm.showChoices.esr, null) > -1 : (_vm.showChoices.esr)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.esr,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "esr", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "esr", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "esr", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(9)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.esr),
      expression: "showChoices.esr"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.esr), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.esr),
        expression: "recordInfoData.tests.esr"
      }],
      attrs: {
        "name": "esr",
        "type": "radio",
        "id": ("esr-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.esr, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "esr", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("esr-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.prlr),
      expression: "showChoices.prlr"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "prlr-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.prlr) ? _vm._i(_vm.showChoices.prlr, null) > -1 : (_vm.showChoices.prlr)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.prlr,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "prlr", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "prlr", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "prlr", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(10)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.prlr),
      expression: "showChoices.prlr"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.prlr), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.prlr),
        expression: "recordInfoData.tests.prlr"
      }],
      attrs: {
        "name": "prlr",
        "type": "radio",
        "id": ("prlr" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.prlr, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "prlr", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("prlr" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.rbp4),
      expression: "showChoices.rbp4"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "rbp4-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.rbp4) ? _vm._i(_vm.showChoices.rbp4, null) > -1 : (_vm.showChoices.rbp4)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.rbp4,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "rbp4", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "rbp4", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "rbp4", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(11)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.rbp4),
      expression: "showChoices.rbp4"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.rbp4), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.rbp4),
        expression: "recordInfoData.tests.rbp4"
      }],
      attrs: {
        "name": "rbp4",
        "type": "radio",
        "id": ("rbp4-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.rbp4, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "rbp4", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("rbp4-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.lif),
      expression: "showChoices.lif"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "lif-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.lif) ? _vm._i(_vm.showChoices.lif, null) > -1 : (_vm.showChoices.lif)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.lif,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "lif", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "lif", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "lif", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(12)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.lif),
      expression: "showChoices.lif"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.lif), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.lif),
        expression: "recordInfoData.tests.lif"
      }],
      attrs: {
        "name": "lif",
        "type": "radio",
        "id": ("lif-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.lif, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "lif", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("lif-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s6",
    attrs: {
      "id": "meat-and-growth-container"
    }
  }, [_c('div', {
    staticClass: "card col s12 card-traits-container"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(13), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.hfabp),
      expression: "showChoices.hfabp"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "hfabp-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.hfabp) ? _vm._i(_vm.showChoices.hfabp, null) > -1 : (_vm.showChoices.hfabp)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.hfabp,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "hfabp", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "hfabp", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "hfabp", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(14)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.hfabp),
      expression: "showChoices.hfabp"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.hfabp), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.hfabp),
        expression: "recordInfoData.tests.hfabp"
      }],
      attrs: {
        "name": "hfabp",
        "type": "radio",
        "id": ("hfabp-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.hfabp, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "hfabp", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("hfabp-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.igf2),
      expression: "showChoices.igf2"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "igf2-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.igf2) ? _vm._i(_vm.showChoices.igf2, null) > -1 : (_vm.showChoices.igf2)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.igf2,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "igf2", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "igf2", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "igf2", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(15)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.igf2),
      expression: "showChoices.igf2"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.igf2), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.igf2),
        expression: "recordInfoData.tests.igf2"
      }],
      attrs: {
        "name": "igf2",
        "type": "radio",
        "id": ("igf2-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.igf2, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "igf2", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("igf2-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.lepr),
      expression: "showChoices.lepr"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "lepr-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.lepr) ? _vm._i(_vm.showChoices.lepr, null) > -1 : (_vm.showChoices.lepr)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.lepr,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "lepr", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "lepr", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "lepr", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(16)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.lepr),
      expression: "showChoices.lepr"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.lepr), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.lepr),
        expression: "recordInfoData.tests.lepr"
      }],
      attrs: {
        "name": "lepr",
        "type": "radio",
        "id": ("lepr-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.lepr, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "lepr", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("lepr-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.myog),
      expression: "showChoices.myog"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "myog-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.myog) ? _vm._i(_vm.showChoices.myog, null) > -1 : (_vm.showChoices.myog)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.myog,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "myog", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "myog", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "myog", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(17)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.myog),
      expression: "showChoices.myog"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.myog), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.myog),
        expression: "recordInfoData.tests.myog"
      }],
      attrs: {
        "name": "myog",
        "type": "radio",
        "id": ("myog-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.myog, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "myog", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("myog-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s6",
    attrs: {
      "id": "defects-container"
    }
  }, [_c('div', {
    staticClass: "card col s12 card-traits-container"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(18), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.pss),
      expression: "showChoices.pss"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "pss-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.pss) ? _vm._i(_vm.showChoices.pss, null) > -1 : (_vm.showChoices.pss)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.pss,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "pss", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "pss", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "pss", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(19)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.pss),
      expression: "showChoices.pss"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.pss), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.pss),
        expression: "recordInfoData.tests.pss"
      }],
      attrs: {
        "name": "pss",
        "type": "radio",
        "id": ("pss-" + index)
      },
      domProps: {
        "value": choice.toUpperCase(),
        "checked": _vm._q(_vm.recordInfoData.tests.pss, choice.toUpperCase())
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "pss", choice.toUpperCase())
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("pss-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.rn),
      expression: "showChoices.rn"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "rn-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.rn) ? _vm._i(_vm.showChoices.rn, null) > -1 : (_vm.showChoices.rn)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.rn,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "rn", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "rn", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "rn", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(20)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.rn),
      expression: "showChoices.rn"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.rn), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.rn),
        expression: "recordInfoData.tests.rn"
      }],
      attrs: {
        "name": "rn",
        "type": "radio",
        "id": ("rn-" + index)
      },
      domProps: {
        "value": choice.toUpperCase(),
        "checked": _vm._q(_vm.recordInfoData.tests.rn, choice.toUpperCase())
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "rn", choice.toUpperCase())
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("rn-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.bax),
      expression: "showChoices.bax"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "bax-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.bax) ? _vm._i(_vm.showChoices.bax, null) > -1 : (_vm.showChoices.bax)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.bax,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "bax", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "bax", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "bax", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(21)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.bax),
      expression: "showChoices.bax"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.bax), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.bax),
        expression: "recordInfoData.tests.bax"
      }],
      attrs: {
        "name": "bax",
        "type": "radio",
        "id": ("bax-" + index)
      },
      domProps: {
        "value": choice.toUpperCase(),
        "checked": _vm._q(_vm.recordInfoData.tests.bax, choice.toUpperCase())
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "bax", choice.toUpperCase())
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("bax-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s6",
    attrs: {
      "id": "diseases-container"
    }
  }, [_c('div', {
    staticClass: "card col s12 card-traits-container"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(22), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.fut1),
      expression: "showChoices.fut1"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "fut1-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.fut1) ? _vm._i(_vm.showChoices.fut1, null) > -1 : (_vm.showChoices.fut1)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.fut1,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "fut1", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "fut1", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "fut1", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(23)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.fut1),
      expression: "showChoices.fut1"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.fut1), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.fut1),
        expression: "recordInfoData.tests.fut1"
      }],
      attrs: {
        "name": "fut1",
        "type": "radio",
        "id": ("fut1-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.fut1, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "fut1", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("fut1-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.mx1),
      expression: "showChoices.mx1"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "mx1-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.mx1) ? _vm._i(_vm.showChoices.mx1, null) > -1 : (_vm.showChoices.mx1)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.mx1,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "mx1", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "mx1", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "mx1", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(24)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.mx1),
      expression: "showChoices.mx1"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.mx1), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.mx1),
        expression: "recordInfoData.tests.mx1"
      }],
      attrs: {
        "name": "mx1",
        "type": "radio",
        "id": ("mx1-" + index)
      },
      domProps: {
        "value": choice.toUpperCase(),
        "checked": _vm._q(_vm.recordInfoData.tests.mx1, choice.toUpperCase())
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "mx1", choice.toUpperCase())
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("mx1-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.nramp),
      expression: "showChoices.nramp"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "nramp-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.nramp) ? _vm._i(_vm.showChoices.nramp, null) > -1 : (_vm.showChoices.nramp)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.nramp,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "nramp", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "nramp", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "nramp", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(25)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.nramp),
      expression: "showChoices.nramp"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.nramp), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.nramp),
        expression: "recordInfoData.tests.nramp"
      }],
      attrs: {
        "name": "nramp",
        "type": "radio",
        "id": ("nramp-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.nramp, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "nramp", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("nramp-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s5 m5"
  }, [_c('p', {
    staticClass: "padded"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.showChoices.bpi),
      expression: "showChoices.bpi"
    }],
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "bpi-checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.showChoices.bpi) ? _vm._i(_vm.showChoices.bpi, null) > -1 : (_vm.showChoices.bpi)
    },
    on: {
      "change": function($event) {
        var $$a = _vm.showChoices.bpi,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.$set(_vm.showChoices, "bpi", $$a.concat([$$v])))
          } else {
            $$i > -1 && (_vm.$set(_vm.showChoices, "bpi", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
          }
        } else {
          _vm.$set(_vm.showChoices, "bpi", $$c)
        }
      }
    }
  }), _vm._v(" "), _vm._m(26)])]), _vm._v(" "), _c('div', {
    staticClass: "col s7 m7"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showChoices.bpi),
      expression: "showChoices.bpi"
    }]
  }, [_c('p', {
    staticClass: "padded"
  }, [_vm._l((_vm.testChoices.bpi), function(choice, index) {
    return [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.recordInfoData.tests.bpi),
        expression: "recordInfoData.tests.bpi"
      }],
      attrs: {
        "name": "bpi",
        "type": "radio",
        "id": ("bpi-" + index)
      },
      domProps: {
        "value": choice,
        "checked": _vm._q(_vm.recordInfoData.tests.bpi, choice)
      },
      on: {
        "change": function($event) {
          _vm.$set(_vm.recordInfoData.tests, "bpi", choice)
        }
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": ("bpi-" + index)
      }
    }, [_vm._v(" " + _vm._s(choice) + " ")])]
  })], 2)])])])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "card-action center-align"
  }, [(!_vm.successfullyRegistered) ? _c('a', {
    staticClass: "btn-flat waves-effect waves-light preview-cert black-text",
    attrs: {
      "href": _vm.tempPdfLink,
      "target": "_blank",
      "name": "action"
    }
  }, [_vm._v("\n                    Preview Temporary PDF\n                ")]) : _vm._e(), _vm._v(" "), _c('button', {
    staticClass: "btn save-btn",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.saveLaboratoryResults($event)
      }
    }
  }, [_vm._v("\n                    Save\n                ")])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" Register Laboratory Results ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row",
    staticStyle: {
      "margin-bottom": "0"
    }
  }, [_c('div', {
    staticClass: "col s12",
    staticStyle: {
      "margin-top": "2rem",
      "padding": "0"
    },
    attrs: {
      "id": "add-lab-result-tabs"
    }
  }, [_c('ul', {
    staticClass: "tabs tabs-fixed-width z-depth-2"
  }, [_c('li', {
    staticClass: "tab col s6"
  }, [_c('a', {
    attrs: {
      "href": "#general-information"
    }
  }, [_vm._v("General Information")])]), _vm._v(" "), _c('li', {
    staticClass: "tab col s6"
  }, [_c('a', {
    attrs: {
      "href": "#genetic-information"
    }
  }, [_vm._v("Genetic Information")])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("Is Farm reigstered in the system?")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('blockquote', {
    staticClass: "info"
  }, [_vm._v("\n                            *   -   Favorable genotype\n                        ")]), _vm._v(" "), _c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("Fertility Traits")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "esr-checkbox"
    }
  }, [_c('b', [_vm._v("ESR")]), _vm._v(" (BB)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "prlr-checkbox"
    }
  }, [_c('b', [_vm._v("PRLR")]), _vm._v(" (AA)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "rbp4-checkbox"
    }
  }, [_c('b', [_vm._v("RBP4")]), _vm._v(" (BB)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "lif-checkbox"
    }
  }, [_c('b', [_vm._v("LIF")]), _vm._v(" (BB)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("Meat Quality and Growth Rate")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "hfabp-checkbox"
    }
  }, [_c('b', [_vm._v("HFABP")]), _vm._v(" (AA)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "igf2-checkbox"
    }
  }, [_c('b', [_vm._v("IGF2")]), _vm._v(" (CC)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "lepr-checkbox"
    }
  }, [_c('b', [_vm._v("LEPR")]), _vm._v(" (BB)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "myog-checkbox"
    }
  }, [_c('b', [_vm._v("MYOG")]), _vm._v(" (AA)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("Genetic Defects")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "pss-checkbox"
    }
  }, [_c('b', [_vm._v("PSS")]), _vm._v(" (Negative)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "rn-checkbox"
    }
  }, [_c('b', [_vm._v("RN")]), _vm._v(" (Negative)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "bax-checkbox"
    }
  }, [_c('b', [_vm._v("BAX")]), _vm._v(" (Negative)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("Diseases Resistance")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "fut1-checkbox"
    }
  }, [_c('b', [_vm._v("FUT1")]), _vm._v(" (AA)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "mx1-checkbox"
    }
  }, [_c('b', [_vm._v("MX1")]), _vm._v(" (Resistant)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "nramp-checkbox"
    }
  }, [_c('b', [_vm._v("NRAMP")]), _vm._v(" (BB)*")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('label', {
    staticClass: "black-text",
    attrs: {
      "for": "bpi-checkbox"
    }
  }, [_c('b', [_vm._v("BPI")]), _vm._v(" (GG)*")])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-091d2757", module.exports)
  }
}

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(130)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(132),
  /* template */
  __webpack_require__(133),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-241c1815",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/ViewLaboratoryResults.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] ViewLaboratoryResults.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-241c1815", Component.options)
  } else {
    hotAPI.reload("data-v-241c1815", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(131);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("17ae8e14", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-241c1815\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ViewLaboratoryResults.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-241c1815\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ViewLaboratoryResults.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.custom-secondary-btn[data-v-241c1815] {\n    border: 1px solid;\n    background-color: white !important;\n}\nspan.title[data-v-241c1815] {\n    font-size: 20px !important;\n}\np.primary-details[data-v-241c1815] {\n    margin: 0;\n    padding-bottom: 1rem;\n}\np.secondary-details[data-v-241c1815] {\n    margin: 0;\n    padding-bottom: 0.7rem;\n    padding-left: 2rem;\n}\np.genetic-details > span[data-v-241c1815] {\n    cursor: pointer;\n}\n\n/* Table styles */\ntable.striped > tbody > tr[data-v-241c1815]:nth-child(odd) {\n    background-color: #f5f5f5;\n}\ntd[data-v-241c1815], th[data-v-241c1815] {\n    padding-left: 1rem;\n}\n.genetic-details table[data-v-241c1815] {\n    margin-top: 0.5rem;\n    margin-left: 2rem;\n}\n.genetic-details table td[data-v-241c1815] {\n    padding-top: 0;\n    padding-right: 0;\n    padding-bottom: 0;\n    padding-left: 1rem;\n}\n.genetic-details table tr td[data-v-241c1815]:first-child {\n    width: 5rem;\n}\n\n/* Fade animations */\n.fade-enter-active[data-v-241c1815], .fade-leave-active[data-v-241c1815] {\n    transition: opacity .5s;\n}\n.fade-enter[data-v-241c1815], .fade-leave-to[data-v-241c1815] /* .fade-leave-active below version 2.1.8 */ {\n    opacity: 0;\n}\n", ""]);

// exports


/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        customLabResults: Array
    },

    data: function data() {
        return {
            pageNumber: 0,
            paginationSize: 6,
            labResults: this.customLabResults
        };
    },


    computed: {
        pageCount: function pageCount() {
            var l = this.labResults.length;
            var s = this.paginationSize;

            return Math.ceil(l / s);
        },
        paginatedLabResults: function paginatedLabResults() {
            var start = this.pageNumber * this.paginationSize;
            var end = start + this.paginationSize;

            return this.labResults.slice(start, end);
        }
    },

    methods: {
        findLabResultIndexById: function findLabResultIndexById(id) {
            for (var i = 0; i < this.labResults.length; i++) {
                if (this.labResults[i].id === id) return i;
            }

            return -1;
        },
        previousPage: function previousPage() {
            // For pagination
            if (this.pageNumber !== 0) this.pageNumber--;
        },
        nextPage: function nextPage() {
            // For pagination
            if (this.pageNumber < this.pageCount - 1) this.pageNumber++;
        },
        goToPage: function goToPage(page) {
            // For pagination
            this.pageNumber = page - 1;
        },
        showGeneticInformation: function showGeneticInformation(id, category) {
            var index = this.findLabResultIndexById(id);

            var booleanValue = this.paginatedLabResults[index]['showTests'][category];
            this.paginatedLabResults[index]['showTests'][category] = !booleanValue;
        }
    }
});

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('table', {
    staticClass: "z-depth-1 striped white"
  }, [_vm._m(2), _vm._v(" "), _c('tbody', _vm._l((_vm.paginatedLabResults), function(result, index) {
    return _c('tr', {
      key: result.id
    }, [_c('td', [_c('span', {
      staticClass: "title"
    }, [_c('b', [_vm._v(_vm._s(result.labResultNo))])]), _vm._v(" "), _c('p', {
      staticClass: "primary-details"
    }, [_vm._v("\n                            " + _vm._s(result.sex) + " • " + _vm._s(result.animalId) + "\n                        ")]), _vm._v(" "), _c('p', {
      staticClass: "secondary-details grey-text text-darken-2"
    }, [_c('span', [_c('i', {
      staticClass: "material-icons left tooltipped",
      attrs: {
        "data-position": "top",
        "data-delay": "50",
        "data-tooltip": "Farm Name"
      }
    }, [_vm._v("\n                                    location_on\n                                ")]), _vm._v(" \n                                " + _vm._s(result.farm.name) + "\n                            ")])]), _vm._v(" "), _c('p', {
      staticClass: "secondary-details grey-text text-darken-2"
    }, [_c('span', [_c('i', {
      staticClass: "material-icons left tooltipped",
      attrs: {
        "data-position": "top",
        "data-delay": "50",
        "data-tooltip": "Date of Result"
      }
    }, [_vm._v("\n                                    event_available\n                                ")]), _vm._v(" \n                                " + _vm._s(result.dateResult) + "\n                            ")])]), _vm._v(" "), _c('p', {
      staticClass: "secondary-details grey-text text-darken-2"
    }, [_c('span', [_c('i', {
      staticClass: "material-icons left tooltipped",
      attrs: {
        "data-position": "top",
        "data-delay": "50",
        "data-tooltip": "Date Submitted"
      }
    }, [_vm._v("\n                                    event_note\n                                ")]), _vm._v(" \n                                " + _vm._s(result.dateSubmitted) + "\n                            ")])])]), _vm._v(" "), _c('td', [_c('p', {
      staticClass: "genetic-details"
    }, [_c('span', {
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showGeneticInformation(result.id, 'fertility')
        }
      }
    }, [_c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (!result.showTests.fertility),
        expression: "!result.showTests.fertility"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_down")]), _vm._v(" "), _c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.fertility),
        expression: "result.showTests.fertility"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_up")]), _vm._v("\n                                Fertility\n                            ")]), _vm._v(" "), _c('transition', {
      attrs: {
        "name": "fade"
      }
    }, [_c('table', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.fertility),
        expression: "result.showTests.fertility"
      }]
    }, [_c('tbody', [_c('tr', [_c('td', [_vm._v("ESR")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.esr) ? result.tests.esr : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("PRLR")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.prlr) ? result.tests.prlr : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("RBP4")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.rbp4) ? result.tests.rbp4 : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("LIF")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.lif) ? result.tests.lif : '---'))])])])])])])], 1), _vm._v(" "), _c('p', {
      staticClass: "genetic-details"
    }, [_c('span', {
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showGeneticInformation(result.id, 'meatAndGrowth')
        }
      }
    }, [_c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (!result.showTests.meatAndGrowth),
        expression: "!result.showTests.meatAndGrowth"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_down")]), _vm._v(" "), _c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.meatAndGrowth),
        expression: "result.showTests.meatAndGrowth"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_up")]), _vm._v("\n                                Meat Quality and Growth Rate\n                            ")]), _vm._v(" "), _c('transition', {
      attrs: {
        "name": "fade"
      }
    }, [_c('table', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.meatAndGrowth),
        expression: "result.showTests.meatAndGrowth"
      }]
    }, [_c('tbody', [_c('tr', [_c('td', [_vm._v("HFABP")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.hfabp) ? result.tests.hfabp : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("IGF2")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.igf2) ? result.tests.igf2 : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("LEPR")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.lepr) ? result.tests.lepr : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("MYOG")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.myog) ? result.tests.myog : '---'))])])])])])])], 1), _vm._v(" "), _c('p', {
      staticClass: "genetic-details"
    }, [_c('span', {
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showGeneticInformation(result.id, 'defects')
        }
      }
    }, [_c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (!result.showTests.defects),
        expression: "!result.showTests.defects"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_down")]), _vm._v(" "), _c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.defects),
        expression: "result.showTests.defects"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_up")]), _vm._v("\n                                Genetic Defects\n                            ")]), _vm._v(" "), _c('transition', {
      attrs: {
        "name": "fade"
      }
    }, [_c('table', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.defects),
        expression: "result.showTests.defects"
      }]
    }, [_c('tbody', [_c('tr', [_c('td', [_vm._v("PSS")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.pss) ? result.tests.pss : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("RN")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.rn) ? result.tests.rn : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("BAX")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.bax) ? result.tests.bax : '---'))])])])])])])], 1), _vm._v(" "), _c('p', {
      staticClass: "genetic-details"
    }, [_c('span', {
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showGeneticInformation(result.id, 'diseases')
        }
      }
    }, [_c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (!result.showTests.diseases),
        expression: "!result.showTests.diseases"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_down")]), _vm._v(" "), _c('i', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.diseases),
        expression: "result.showTests.diseases"
      }],
      staticClass: "material-icons left"
    }, [_vm._v("keyboard_arrow_up")]), _vm._v("\n                                Diseases Resistance\n                            ")]), _vm._v(" "), _c('transition', {
      attrs: {
        "name": "fade"
      }
    }, [_c('table', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (result.showTests.diseases),
        expression: "result.showTests.diseases"
      }]
    }, [_c('tbody', [_c('tr', [_c('td', [_vm._v("FUT1")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.fut1) ? result.tests.fut1 : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("MX1")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.mx1) ? result.tests.mx1 : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("NRAMP")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.nramp) ? result.tests.nramp : '---'))])])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v("BPI")]), _vm._v(" "), _c('td', [_c('b', [_vm._v(_vm._s((result.tests.bpi) ? result.tests.bpi : '---'))])])])])])])], 1)]), _vm._v(" "), _c('td', [_c('a', {
      staticClass: "btn blue darken-1 z-depth-0",
      attrs: {
        "href": "#!"
      }
    }, [_vm._v("\n                            Edit\n                        ")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _c('a', {
      staticClass: "btn custom-secondary-btn blue-text text-darken-1 z-depth-0",
      attrs: {
        "href": ("/genomics/pdf-lab-results/" + (result.id)),
        "target": "_blank"
      }
    }, [_vm._v("\n                            View PDF\n                        ")])])])
  }))])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 center-align pagination-container"
  }, [_c('ul', {
    staticClass: "pagination"
  }, [_c('li', {
    class: (_vm.pageNumber === 0) ? 'disabled' : 'waves-effect'
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.previousPage()
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("chevron_left")])])]), _vm._v(" "), _vm._l((_vm.pageCount), function(i) {
    return _c('li', {
      staticClass: "waves-effect",
      class: (i === _vm.pageNumber + 1) ? 'active' : 'waves-effect'
    }, [_c('a', {
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.goToPage(i)
        }
      }
    }, [_vm._v(" " + _vm._s(i) + " ")])])
  }), _vm._v(" "), _c('li', {
    class: (_vm.pageNumber >= _vm.pageCount - 1) ? 'disabled' : 'waves-effect'
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.nextPage()
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("chevron_right")])])])], 2)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" View Laboratory Results ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('p', [_c('br')])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', [_c('tr', [_c('th', [_vm._v("General Information")]), _vm._v(" "), _c('th', [_vm._v("Genetic Information")]), _vm._v(" "), _c('th', [_vm._v("Action")])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-241c1815", module.exports)
  }
}

/***/ }),
/* 134 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[19]);