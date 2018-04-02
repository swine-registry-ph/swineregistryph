webpackJsonp([0],[
/* 0 */,
/* 1 */
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
/* 2 */
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
/* 3 */
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

var listToStyles = __webpack_require__(51)

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(19);
module.exports = __webpack_require__(94);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

__webpack_require__(20);

window.Vue = __webpack_require__(16);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// App
Vue.component('app-input-date', __webpack_require__(42));
Vue.component('app-input-select', __webpack_require__(45));

// Breeder
Vue.component('register-swine-parents-properties', __webpack_require__(48));
Vue.component('register-swine-properties', __webpack_require__(54));
Vue.component('register-swine-summary', __webpack_require__(59));
Vue.component('register-swine-upload-photo', __webpack_require__(64));
Vue.component('register-swine', __webpack_require__(69));
Vue.component('view-registered-swine', __webpack_require__(74));

// Admin
Vue.component('manage-breeds', __webpack_require__(79));
Vue.component('manage-properties', __webpack_require__(84));
Vue.component('manage-apis', __webpack_require__(89));

// For main container
var app = new Vue({
    el: '#app'
});

// For header container
var nav = new Vue({
    el: '#custom-nav',

    data: {
        currentRoute: {
            admin: {
                adminViewRegdSwine: false,
                manageAccreditedFarms: false,
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
                reports: false,
                swineCart: false
            }
        }
    },

    mounted: function mounted() {
        // Initialize side navigation
        $(".button-collapse").sideNav();

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

            case '/breeder/manage-swine/register':
                this.currentRoute.breeder.showRegForm = true;
                break;

            case '/breeder/manage-swine/view':
                this.currentRoute.breeder.viewRegdSwine = true;
                break;

            case '/breeder/swinecart':
                this.currentRoute.breeder.swineCart = true;
                break;

            default:
                break;

        }
    }
});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

window._ = __webpack_require__(6);

/**
 * We'll load jQuery and the MaterializeCSS jQuery plugin which provides support
 * for JavaScript based MaterializeCSS features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
  window.$ = window.jQuery = __webpack_require__(4);

  __webpack_require__(9);
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(10);

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
/* 21 */,
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
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(43),
  /* template */
  __webpack_require__(44),
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
/* 43 */
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
/* 44 */
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(46),
  /* template */
  __webpack_require__(47),
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
/* 46 */
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
/* 47 */
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
      "disabled": "",
      "selected": ""
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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(49)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(52),
  /* template */
  __webpack_require__(53),
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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("2dc705b9", content, false);
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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\ndiv.collapsible-body[data-v-17cbae1c] {\n    overflow: auto;\n}\n", ""]);

// exports


/***/ }),
/* 51 */
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
/* 52 */
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        farmoptions: Array
    },

    data: function data() {
        return {
            gpSireIdPrefix: 'gp-sire-',
            gpDamIdPrefix: 'gp-dam-',
            collapsibleStatus: {
                sire: true,
                dam: true
            },
            status: {
                sire: 'existing',
                dam: 'existing'
            },
            existingParents: {
                sireRegNo: '',
                damRegNo: ''
            },
            gpSire: {
                importedRegNo: '',
                geneticInfoId: '',
                farmFrom: '',
                birthDate: '',
                dateCollected: '',
                houseType: '',
                teatNo: '',
                weight: '',
                adgBirth_endDate: '',
                adgBirth_endWeight: '',
                adgTest_startDate: '',
                adgTest_endDate: '',
                adgTest_startWeight: '',
                adgTest_endWeight: '',
                bft: '',
                fe: '',
                birth_weight: '',
                littersizeAlive_male: '',
                littersizeAlive_female: '',
                parity: '',
                littersize_weaning: '',
                litterweight_weaning: '',
                date_weaning: ''
            },
            gpDam: {
                importedRegNo: '',
                geneticInfoId: '',
                farmFrom: '',
                birthDate: '',
                dateCollected: '',
                houseType: '',
                teatNo: '',
                weight: '',
                adgBirth_endDate: '',
                adgBirth_endWeight: '',
                adgTest_startDate: '',
                adgTest_endDate: '',
                adgTest_startWeight: '',
                adgTest_endWeight: '',
                bft: '',
                fe: '',
                birth_weight: '',
                littersizeAlive_male: '',
                littersizeAlive_female: '',
                parity: '',
                littersize_weaning: '',
                litterweight_weaning: '',
                date_weaning: ''
            }
        };
    },


    watch: {
        'status.sire': function statusSire() {
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },

        'status.dam': function statusDam() {
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        }
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
/* 53 */
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
  }, [_c('i', {
    staticClass: "material-icons"
  }, [(_vm.collapsibleStatus.sire) ? [_vm._v("\n                                            label_outline\n                                        ")] : [_vm._v("\n                                            label\n                                        ")]], 2), _vm._v("\n                                    GP Sire\n                                ")]), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('div', {
    staticClass: "col s12 m12 l6 offset-l3",
    attrs: {
      "id": "sire-container"
    }
  }, [_c('div', {
    staticClass: "col s12"
  }, [_vm._m(1), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.status.sire),
      expression: "status.sire"
    }],
    attrs: {
      "name": "sire-status",
      "type": "radio",
      "id": "sire-new",
      "value": "new"
    },
    domProps: {
      "checked": _vm._q(_vm.status.sire, "new")
    },
    on: {
      "__c": function($event) {
        _vm.status.sire = "new"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "sire-new"
    }
  }, [_vm._v("Sire is not yet registered in the system")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.status.sire),
      expression: "status.sire"
    }],
    attrs: {
      "name": "sire-status",
      "type": "radio",
      "id": "sire-existing",
      "value": "existing"
    },
    domProps: {
      "checked": _vm._q(_vm.status.sire, "existing")
    },
    on: {
      "__c": function($event) {
        _vm.status.sire = "existing"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "sire-existing"
    }
  }, [_vm._v("Sire is currently registered in the system")])])]), _vm._v(" "), _vm._m(2), _vm._v(" "), (_vm.status.sire === 'existing') ? [_c('div', {
    staticClass: "col s8 offset-s2 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.existingParents.sireRegNo),
      expression: "existingParents.sireRegNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'existing',
      "type": "text"
    },
    domProps: {
      "value": (_vm.existingParents.sireRegNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.existingParents.sireRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'gpSire'
    }
  }, [_vm._v("GP Sire Registration #")])])] : (_vm.status.sire === 'new') ? [_c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.importedRegNo),
      expression: "gpSire.importedRegNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'imported-reg-no',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.importedRegNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.importedRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'imported-reg-no'
    }
  }, [_vm._v("Imported Animal/Semen Registration # (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.geneticInfoId),
      expression: "gpSire.geneticInfoId"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'genetic-info-id',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.geneticInfoId)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.geneticInfoId = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'genetic-info-id'
    }
  }, [_vm._v("Genetic Information ID (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Farm From",
      "options": _vm.farmoptions
    },
    on: {
      "select": function (val) {
        _vm.gpSire.farmFrom = val
      }
    },
    model: {
      value: (_vm.gpSire.farmFrom),
      callback: function($$v) {
        _vm.gpSire.farmFrom = $$v
      },
      expression: "gpSire.farmFrom"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpSire.birthDate = val
      }
    },
    model: {
      value: (_vm.gpSire.birthDate),
      callback: function($$v) {
        _vm.gpSire.birthDate = $$v
      },
      expression: "gpSire.birthDate"
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
      value: (_vm.gpSire.birth_weight),
      expression: "gpSire.birth_weight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'birth-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.birth_weight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.birth_weight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'birth-weight'
    }
  }, [_vm._v("Birth Weight")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpSire.dateCollected = val
      }
    },
    model: {
      value: (_vm.gpSire.dateCollected),
      callback: function($$v) {
        _vm.gpSire.dateCollected = $$v
      },
      expression: "gpSire.dateCollected"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date when data was collected ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.weight),
      expression: "gpSire.weight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.weight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.weight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'weight'
    }
  }, [_vm._v("Weight when data was collected")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.bft),
      expression: "gpSire.bft"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'bft',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.bft)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.bft = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'bft'
    }
  }, [_vm._v("Backfat Thickness (mm)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.fe),
      expression: "gpSire.fe"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'feed-efficiency',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.fe)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.fe = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'feed-efficiency'
    }
  }, [_vm._v("Feed Efficiency (gain/feed)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.teatNo),
      expression: "gpSire.teatNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'teatno',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.teatNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.teatNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'teatno'
    }
  }, [_vm._v("Teat number")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.parity),
      expression: "gpSire.parity"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'parity',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.parity)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.parity = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'parity'
    }
  }, [_vm._v("Parity")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.littersizeAlive_male),
      expression: "gpSire.littersizeAlive_male"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'total-m',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.littersizeAlive_male)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.littersizeAlive_male = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'total-m'
    }
  }, [_vm._v("Total (M) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.littersizeAlive_female),
      expression: "gpSire.littersizeAlive_female"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'total-f',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.littersizeAlive_female)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.littersizeAlive_female = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'total-f'
    }
  }, [_vm._v("Total (F) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.littersize_weaning),
      expression: "gpSire.littersize_weaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'littersize-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.littersize_weaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.littersize_weaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'littersize-weaning'
    }
  }, [_vm._v("Littersize at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.litterweight_weaning),
      expression: "gpSire.litterweight_weaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'litterweight-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.litterweight_weaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.litterweight_weaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'litterweight-weaning'
    }
  }, [_vm._v("Litter weight at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpSire.date_weaning = val
      }
    },
    model: {
      value: (_vm.gpSire.date_weaning),
      callback: function($$v) {
        _vm.gpSire.date_weaning = $$v
      },
      expression: "gpSire.date_weaning"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date at weaning ")])], 1), _vm._v(" "), _vm._m(3), _vm._v(" "), _vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpSire.adgBirth_endDate = val
      }
    },
    model: {
      value: (_vm.gpSire.adgBirth_endDate),
      callback: function($$v) {
        _vm.gpSire.adgBirth_endDate = $$v
      },
      expression: "gpSire.adgBirth_endDate"
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
      value: (_vm.gpSire.adgBirth_endWeight),
      expression: "gpSire.adgBirth_endWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'adg-birth-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.adgBirth_endWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.adgBirth_endWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'adg-birth-end-weight'
    }
  }, [_vm._v("End Weight")])]), _vm._v(" "), _vm._m(5), _vm._v(" "), _vm._m(6), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpSire.adgTest_startDate = val
      }
    },
    model: {
      value: (_vm.gpSire.adgTest_startDate),
      callback: function($$v) {
        _vm.gpSire.adgTest_startDate = $$v
      },
      expression: "gpSire.adgTest_startDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Start Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.adgTest_startWeight),
      expression: "gpSire.adgTest_startWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'adg-test-start-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.adgTest_startWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.adgTest_startWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'adg-test-start-weight'
    }
  }, [_vm._v("Start Weight")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpSire.adgTest_endDate = val
      }
    },
    model: {
      value: (_vm.gpSire.adgTest_endDate),
      callback: function($$v) {
        _vm.gpSire.adgTest_endDate = $$v
      },
      expression: "gpSire.adgTest_endDate"
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
      value: (_vm.gpSire.adgTest_endWeight),
      expression: "gpSire.adgTest_endWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpSireIdPrefix + 'adg-test-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpSire.adgTest_endWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpSire.adgTest_endWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpSireIdPrefix + 'adg-test-end-weight'
    }
  }, [_vm._v("End Weight")])]), _vm._v(" "), _vm._m(7), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_vm._m(8), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.houseType),
      expression: "gpSire.houseType"
    }],
    attrs: {
      "name": "sire-house-type",
      "type": "radio",
      "id": "sire-house-type-tunnel",
      "value": "tunnel"
    },
    domProps: {
      "checked": _vm._q(_vm.gpSire.houseType, "tunnel")
    },
    on: {
      "__c": function($event) {
        _vm.gpSire.houseType = "tunnel"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "sire-house-type-tunnel"
    }
  }, [_vm._v("Tunnel ventilated")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.houseType),
      expression: "gpSire.houseType"
    }],
    attrs: {
      "name": "sire-house-type",
      "type": "radio",
      "id": "sire-house-type-open",
      "value": "open"
    },
    domProps: {
      "checked": _vm._q(_vm.gpSire.houseType, "open")
    },
    on: {
      "__c": function($event) {
        _vm.gpSire.houseType = "open"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "sire-house-type-open"
    }
  }, [_vm._v("Open sided")])])])] : _vm._e()], 2)])]), _vm._v(" "), _c('li', [_c('div', {
    staticClass: "collapsible-header",
    on: {
      "click": function($event) {
        _vm.collapsibleStatus.dam = !_vm.collapsibleStatus.dam
      }
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [(_vm.collapsibleStatus.dam) ? [_vm._v("\n                                            label_outline\n                                        ")] : [_vm._v("\n                                            label\n                                        ")]], 2), _vm._v("\n                                    GP Dam\n                                ")]), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('div', {
    staticClass: "col s12 m12 l6 offset-l3",
    attrs: {
      "id": "dam-container"
    }
  }, [_c('div', {
    staticClass: "col s12"
  }, [_vm._m(9), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.status.dam),
      expression: "status.dam"
    }],
    attrs: {
      "name": "dam-status",
      "type": "radio",
      "id": "dam-new",
      "value": "new"
    },
    domProps: {
      "checked": _vm._q(_vm.status.dam, "new")
    },
    on: {
      "__c": function($event) {
        _vm.status.dam = "new"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "dam-new"
    }
  }, [_vm._v("Dam is not yet registered in the system")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.status.dam),
      expression: "status.dam"
    }],
    attrs: {
      "name": "dam-status",
      "type": "radio",
      "id": "dam-existing",
      "value": "existing"
    },
    domProps: {
      "checked": _vm._q(_vm.status.dam, "existing")
    },
    on: {
      "__c": function($event) {
        _vm.status.dam = "existing"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "dam-existing"
    }
  }, [_vm._v("Dam is currently registered in the system")])])]), _vm._v(" "), _vm._m(10), _vm._v(" "), (_vm.status.dam === 'existing') ? [_c('div', {
    staticClass: "col s8 offset-s2 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.existingParents.damRegNo),
      expression: "existingParents.damRegNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'existing',
      "type": "text"
    },
    domProps: {
      "value": (_vm.existingParents.damRegNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.existingParents.damRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'gpDam'
    }
  }, [_vm._v("GP Dam Registration #")])])] : (_vm.status.dam === 'new') ? [_c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.importedRegNo),
      expression: "gpDam.importedRegNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'imported-reg-no',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.importedRegNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.importedRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'imported-reg-no'
    }
  }, [_vm._v("Imported Animal Registration # (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.geneticInfoId),
      expression: "gpDam.geneticInfoId"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'genetic-info-id',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.geneticInfoId)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.geneticInfoId = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'genetic-info-id'
    }
  }, [_vm._v("Genetic Information ID (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Farm From",
      "options": _vm.farmoptions
    },
    on: {
      "select": function (val) {
        _vm.gpDam.farmFrom = val
      }
    },
    model: {
      value: (_vm.gpDam.farmFrom),
      callback: function($$v) {
        _vm.gpDam.farmFrom = $$v
      },
      expression: "gpDam.farmFrom"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpDam.birthDate = val
      }
    },
    model: {
      value: (_vm.gpDam.birthDate),
      callback: function($$v) {
        _vm.gpDam.birthDate = $$v
      },
      expression: "gpDam.birthDate"
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
      value: (_vm.gpDam.birth_weight),
      expression: "gpDam.birth_weight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'birth-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.birth_weight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.birth_weight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'birth-weight'
    }
  }, [_vm._v("Birth Weight")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpSire.date_weaning = val
      }
    },
    model: {
      value: (_vm.gpSire.date_weaning),
      callback: function($$v) {
        _vm.gpSire.date_weaning = $$v
      },
      expression: "gpSire.date_weaning"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date when data was collected ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.weight),
      expression: "gpDam.weight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.weight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.weight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'weight'
    }
  }, [_vm._v("Weight when data was collected")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.bft),
      expression: "gpDam.bft"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'bft',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.bft)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.bft = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'bft'
    }
  }, [_vm._v("Backfat Thickness (mm)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.fe),
      expression: "gpDam.fe"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'feed-efficiency',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.fe)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.fe = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'feed-efficiency'
    }
  }, [_vm._v("Feed Efficiency (gain/feed)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.teatNo),
      expression: "gpDam.teatNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'teatno',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.teatNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.teatNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'teatno'
    }
  }, [_vm._v("Teat number")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.parity),
      expression: "gpDam.parity"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'parity',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.parity)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.parity = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'parity'
    }
  }, [_vm._v("Parity")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.littersizeAlive_male),
      expression: "gpDam.littersizeAlive_male"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'total-m',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.littersizeAlive_male)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.littersizeAlive_male = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'total-m'
    }
  }, [_vm._v("Total (M) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.littersizeAlive_female),
      expression: "gpDam.littersizeAlive_female"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'total-f',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.littersizeAlive_female)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.littersizeAlive_female = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'total-f'
    }
  }, [_vm._v("Total (F) born alive")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.littersize_weaning),
      expression: "gpDam.littersize_weaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'littersize-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.littersize_weaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.littersize_weaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'littersize-weaning'
    }
  }, [_vm._v("Littersize at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.litterweight_weaning),
      expression: "gpDam.litterweight_weaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'litterweight-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.litterweight_weaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.litterweight_weaning = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'litterweight-weaning'
    }
  }, [_vm._v("Litter weight at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpDam.date_weaning = val
      }
    },
    model: {
      value: (_vm.gpDam.date_weaning),
      callback: function($$v) {
        _vm.gpDam.date_weaning = $$v
      },
      expression: "gpDam.date_weaning"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date at weaning ")])], 1), _vm._v(" "), _vm._m(11), _vm._v(" "), _vm._m(12), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpDam.adgBirth_endDate = val
      }
    },
    model: {
      value: (_vm.gpDam.adgBirth_endDate),
      callback: function($$v) {
        _vm.gpDam.adgBirth_endDate = $$v
      },
      expression: "gpDam.adgBirth_endDate"
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
      value: (_vm.gpDam.adgBirth_endWeight),
      expression: "gpDam.adgBirth_endWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'adg-birth-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.adgBirth_endWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.adgBirth_endWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'adg-birth-end-weight'
    }
  }, [_vm._v("End Weight")])]), _vm._v(" "), _vm._m(13), _vm._v(" "), _vm._m(14), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpDam.adgTest_startDate = val
      }
    },
    model: {
      value: (_vm.gpDam.adgTest_startDate),
      callback: function($$v) {
        _vm.gpDam.adgTest_startDate = $$v
      },
      expression: "gpDam.adgTest_startDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Start Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.adgTest_startWeight),
      expression: "gpDam.adgTest_startWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'adg-test-start-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.adgTest_startWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.adgTest_startWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'adg-test-start-weight'
    }
  }, [_vm._v("Start Weight")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpDam.adgTest_endDate = val
      }
    },
    model: {
      value: (_vm.gpDam.adgTest_endDate),
      callback: function($$v) {
        _vm.gpDam.adgTest_endDate = $$v
      },
      expression: "gpDam.adgTest_endDate"
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
      value: (_vm.gpDam.adgTest_endWeight),
      expression: "gpDam.adgTest_endWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpDamIdPrefix + 'adg-test-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpDam.adgTest_endWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpDam.adgTest_endWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpDamIdPrefix + 'adg-test-end-weight'
    }
  }, [_vm._v("End Weight")])]), _vm._v(" "), _vm._m(15), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_vm._m(16), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpDam.houseType),
      expression: "gpDam.houseType"
    }],
    attrs: {
      "name": "dam-house-type",
      "type": "radio",
      "id": "dam-house-type-tunnel",
      "value": "tunnel"
    },
    domProps: {
      "checked": _vm._q(_vm.gpDam.houseType, "tunnel")
    },
    on: {
      "__c": function($event) {
        _vm.gpDam.houseType = "tunnel"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "dam-house-type-tunnel"
    }
  }, [_vm._v("Tunnel ventilated")])]), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpSire.houseType),
      expression: "gpSire.houseType"
    }],
    attrs: {
      "name": "dam-house-type",
      "type": "radio",
      "id": "dam-house-type-open",
      "value": "open"
    },
    domProps: {
      "checked": _vm._q(_vm.gpSire.houseType, "open")
    },
    on: {
      "__c": function($event) {
        _vm.gpSire.houseType = "open"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "dam-house-type-open"
    }
  }, [_vm._v("Open sided")])])])] : _vm._e()], 2)])])])]), _vm._v(" "), _vm._m(17), _vm._v(" "), _vm._m(18), _vm._v(" "), _c('div', {
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
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain computation from Birth")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain computation on Test")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', [_c('b', [_vm._v("House Type")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
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
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain computation from Birth")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain computation on Test")])])])
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
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(55)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(57),
  /* template */
  __webpack_require__(58),
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
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("cc50fd36", content, false);
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            gpOneIdPrefix: 'gp-one-',
            gpOne: {
                houseType: '',
                teatNo: '',
                weight: '',
                adgBirth_endDate: '',
                adgBirth_endWeight: '',
                adgTest_startDate: '',
                adgTest_endDate: '',
                adgTest_startWeight: '',
                adgTest_endWeight: '',
                bft: '',
                fe: '',
                birth_weight: '',
                littersizeAlive_male: '',
                littersizeAlive_female: '',
                parity: '',
                littersize_weaning: '',
                litterweight_weaning: '',
                date_weaning: ''
            }
        };
    },


    methods: {
        objectIsEmpty: function objectIsEmpty(obj) {
            return _.isEmpty(obj);
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
/* 58 */
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
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.birth_weight),
      expression: "gpOne.birth_weight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'birth-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.birth_weight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.birth_weight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'birth-weight'
    }
  }, [_vm._v("Birth weight")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.weight),
      expression: "gpOne.weight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.weight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.weight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'weight'
    }
  }, [_vm._v("Weight when data was collected")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.bft),
      expression: "gpOne.bft"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'bft',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.bft)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.bft = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'bft'
    }
  }, [_vm._v("Backfat Thickness (mm)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.fe),
      expression: "gpOne.fe"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'feed-efficiency',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.fe)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.fe = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'feed-efficiency'
    }
  }, [_vm._v("Feed Efficiency (gain/feed)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.teatNo),
      expression: "gpOne.teatNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'teatno',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.teatNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.teatNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'teatno'
    }
  }, [_vm._v("Teat number")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.parity),
      expression: "gpOne.parity"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'parity',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.parity)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.parity = $event.target.value
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
      value: (_vm.gpOne.littersizeAlive_male),
      expression: "gpOne.littersizeAlive_male"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'total-m',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.littersizeAlive_male)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.littersizeAlive_male = $event.target.value
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
      value: (_vm.gpOne.littersizeAlive_female),
      expression: "gpOne.littersizeAlive_female"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'total-f',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.littersizeAlive_female)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.littersizeAlive_female = $event.target.value
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
      value: (_vm.gpOne.littersize_weaning),
      expression: "gpOne.littersize_weaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'littersize-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.littersize_weaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.littersize_weaning = $event.target.value
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
      value: (_vm.gpOne.litterweight_weaning),
      expression: "gpOne.litterweight_weaning"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'litterweight-weaning',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.litterweight_weaning)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.litterweight_weaning = $event.target.value
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
        _vm.gpOne.date_weaning = val
      }
    },
    model: {
      value: (_vm.gpOne.date_weaning),
      callback: function($$v) {
        _vm.gpOne.date_weaning = $$v
      },
      expression: "gpOne.date_weaning"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date at weaning ")])], 1), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOne.adgBirth_endDate = val
      }
    },
    model: {
      value: (_vm.gpOne.adgBirth_endDate),
      callback: function($$v) {
        _vm.gpOne.adgBirth_endDate = $$v
      },
      expression: "gpOne.adgBirth_endDate"
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
      value: (_vm.gpOne.adgBirth_endWeight),
      expression: "gpOne.adgBirth_endWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'adg-birth-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.adgBirth_endWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.adgBirth_endWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'adg-birth-end-weight'
    }
  }, [_vm._v("End Weight")])]), _vm._v(" "), _vm._m(3), _vm._v(" "), _vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOne.adgTest_startDate = val
      }
    },
    model: {
      value: (_vm.gpOne.adgTest_startDate),
      callback: function($$v) {
        _vm.gpOne.adgTest_startDate = $$v
      },
      expression: "gpOne.adgTest_startDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Start Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.adgTest_startWeight),
      expression: "gpOne.adgTest_startWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'adg-test-start-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.adgTest_startWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.adgTest_startWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'adg-test-start-weight'
    }
  }, [_vm._v("Start Weight")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.gpOne.adgTest_endDate = val
      }
    },
    model: {
      value: (_vm.gpOne.adgTest_endDate),
      callback: function($$v) {
        _vm.gpOne.adgTest_endDate = $$v
      },
      expression: "gpOne.adgTest_endDate"
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
      value: (_vm.gpOne.adgTest_endWeight),
      expression: "gpOne.adgTest_endWeight"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.gpOneIdPrefix + 'adg-test-end-weight',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.adgTest_endWeight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.adgTest_endWeight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.gpOneIdPrefix + 'adg-test-end-weight'
    }
  }, [_vm._v("End Weight")])]), _vm._v(" "), _vm._m(5), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_vm._m(6), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.houseType),
      expression: "gpOne.houseType"
    }],
    attrs: {
      "name": "house-type",
      "type": "radio",
      "id": "house-type-tunnel",
      "value": "tunnel"
    },
    domProps: {
      "checked": _vm._q(_vm.gpOne.houseType, "tunnel")
    },
    on: {
      "__c": function($event) {
        _vm.gpOne.houseType = "tunnel"
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
      value: (_vm.gpOne.houseType),
      expression: "gpOne.houseType"
    }],
    attrs: {
      "name": "house-type",
      "type": "radio",
      "id": "house-type-open",
      "value": "open"
    },
    domProps: {
      "checked": _vm._q(_vm.gpOne.houseType, "open")
    },
    on: {
      "__c": function($event) {
        _vm.gpOne.houseType = "open"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "house-type-open"
    }
  }, [_vm._v("Open sided")])])]), _vm._v(" "), _vm._m(7)]), _vm._v(" "), _c('div', {
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
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain computation from Birth")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_c('b', [_vm._v("Average Daily Gain computation on Test")])])])
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
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-62492e3a", module.exports)
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
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(62),
  /* template */
  __webpack_require__(63),
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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("3e7f32f6", content, false);
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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n#swine-summary-table td[data-v-4aec38b4] {\n    padding: 0;\n}\n#swine-summary-table tr td[data-v-4aec38b4]:first-child {\n    color: #757575;\n}\n#swine-summary-table tr td[data-v-4aec38b4]:last-child {\n    color: black;\n}\n#swinecart-container div.row[data-v-4aec38b4],\n#geneticinfo-container div.row[data-v-4aec38b4] {\n    margin-bottom: 0px;\n}\n#swinecart-container div.row[data-v-4aec38b4] {\n    padding-top: 1rem;\n}\n\n/* Accent highlights on cards */\n#swineinfo-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #2672a6;\n}\n#swinecart-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #26a69a;\n}\n#geneticinfo-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #26a65a;\n}\n#photos-container > .card[data-v-4aec38b4] {\n    border-top: 4px solid #a62632;\n}\n", ""]);

// exports


/***/ }),
/* 62 */
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        basicInfo: Object,
        gpOneData: Object,
        gpSire: String,
        gpDam: String,
        imageFiles: Array,
        breeds: Array,
        farmoptions: Array
    },

    data: function data() {
        return {
            summaryImageFiles: this.imageFiles,
            currentPrimaryPhotoIndex: -1
        };
    },


    computed: {
        generateCertificateLink: function generateCertificateLink() {
            var certificateLink = '/breeder/registry-certificate';
            return certificateLink + '/' + this.basicInfo.id;
        }
    },

    methods: {
        getIndex: function getIndex(id, arrayToBeSearched) {
            // Return index of object to find
            for (var i = 0; i < arrayToBeSearched.length; i++) {
                if (arrayToBeSearched[i].id === id) return i;
            }
        },
        setAsPrimaryPhoto: function setAsPrimaryPhoto(chosenPhotoId) {
            var vm = this;
            var index = this.getIndex(chosenPhotoId, this.summaryImageFiles);
            var currentPrimaryPhotoIndex = this.currentPrimaryPhotoIndex;

            axios.post('/breeder/manage-swine/set-primary-photo', {
                swineId: vm.basicInfo.id,
                photoId: chosenPhotoId
            }).then(function (response) {
                // Change current primary photo if there is any
                if (currentPrimaryPhotoIndex >= 0) vm.summaryImageFiles[currentPrimaryPhotoIndex].isPrimaryPhoto = false;

                vm.summaryImageFiles[index].isPrimaryPhoto = true;
                vm.currentPrimaryPhotoIndex = index;
            }).catch(function (error) {
                console.error(error);
            });
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 63 */
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
    staticClass: "col s12 m12 l6",
    attrs: {
      "id": "swineinfo-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(1), _vm._v(" "), _c('table', {
    attrs: {
      "id": "swine-summary-table"
    }
  }, [_c('tbody', [_c('tr', [_c('td', [_vm._v(" GP Sire ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSire))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" GP Dam ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDam))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Breed ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.breed))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Sex ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.sex))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Date ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.birthDate))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Weight when data was collected ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.weight))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm From ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.farmFrom))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date collected ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.dateCollected))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Average Daily Gain ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.adg))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Backfat Thickness ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.bft))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Feed Efficiency ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.fe))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Weight ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.birth_weight))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (M) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersizeAlive_male))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (F) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersizeAlive_female))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Parity ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.parity))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Littersize at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersize_weaning))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total litterweight at weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.litterweight_weaning))])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.date_weaning))])])])])])])]), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "col s12",
    attrs: {
      "id": "photos-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, _vm._l((_vm.summaryImageFiles), function(photo) {
    return _c('div', {
      key: photo.id,
      staticClass: "col s12 m6"
    }, [_c('div', {
      staticClass: "card"
    }, [_c('div', {
      staticClass: "card-image"
    }, [_c('img', {
      attrs: {
        "src": photo.fullFilePath
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "card-title"
    })]), _vm._v(" "), _c('div', {
      staticClass: "card-action"
    }, [(photo.isPrimaryPhoto) ? _c('a', {
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
        }
      }
    }, [_c('i', {
      staticClass: "material-icons left"
    }, [_vm._v("photo")]), _vm._v(" Primary Photo\n                                            ")]) : _c('a', {
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.setAsPrimaryPhoto(photo.id)
        }
      }
    }, [_vm._v("\n                                                Set as Primary\n                                            ")])])])])
  }))])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12 center-align"
  }, [_c('a', {
    staticClass: "btn waves-effect waves-light",
    attrs: {
      "href": _vm.generateCertificateLink,
      "type": "submit",
      "name": "action"
    }
  }, [_vm._v("\n                        Submit and Generate Certificate\n                    ")])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("Swine Information")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12 m12 l6"
  }, [_c('div', {
    staticClass: "col s12",
    attrs: {
      "id": "swinecart-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("SwineCart")])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('input', {
    staticClass: "filled-in",
    attrs: {
      "type": "checkbox",
      "id": "check-swinecart"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "check-swinecart"
    }
  }, [_vm._v("Include this swine in SwineCart?")])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "col s12",
    attrs: {
      "id": "geneticinfo-container"
    }
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("Genetic Information")])]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s12 input-field"
  }, [_c('input', {
    staticClass: "validate",
    attrs: {
      "type": "text",
      "id": "geneticinfo-id"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "geneticinfo-id"
    }
  }, [_vm._v("Genetic Information ID # (optional)")])])])])])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h6', {
    staticClass: "center-align"
  }, [_c('b', [_vm._v("Photos")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4aec38b4", module.exports)
  }
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(65)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(67),
  /* template */
  __webpack_require__(68),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
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
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("3008fccf", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bf32331\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineUploadPhoto.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5bf32331\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisterSwineUploadPhoto.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Custom style from vue-dropzone */\n.vue-dropzone {\n    margin-top: 3rem;\n    min-height: 20rem;\n    border: 2px solid #000000;\n    font-family: inherit;\n    letter-spacing: 0.2px;\n    color: #777;\n    transition: background-color .2s linear;\n&:hover {\n        background-color: #F6F6F6;\n}\ni {\n        color: #CCC;\n}\n.dz-preview {\n.dz-image {\n            border-radius: 1;\n&:hover {\nimg {\n                    transform: none;\n                    -webkit-filter: none;\n}\n}\n}\n.dz-details {\n            bottom: 0;\n            top: 0;\n            color: white;\n            background-color: rgba(33, 150, 243, 0.8);\n            transition: opacity .2s linear;\n            text-align: left;\n.dz-filename span, .dz-size span {\n                background-color: transparent;\n}\n.dz-filename:not(:hover) span {\n                border: none;\n}\n.dz-filename:hover span {\n                background-color: transparent;\n                border: none;\n}\n}\n.dz-progress .dz-upload {\n            background: #cccccc;\n}\n.dz-remove {\n            position: absolute;\n            z-index: 30;\n            color: white;\n            margin-left: 15px;\n            padding: 10px;\n            top: inherit;\n            bottom: 15px;\n            border: 2px white solid;\n            text-decoration: none;\n            text-transform: uppercase;\n            font-size: 0.8rem;\n            font-weight: 800;\n            letter-spacing: 1.1px;\n            opacity: 0;\n}\n&:hover {\n.dz-remove {\n                opacity: 1;\n}\n}\n.dz-success-mark, .dz-error-mark {\n            margin-left: auto !important;\n            margin-top: auto !important;\n            width: 100% !important;\n            top: 35% !important;\n            left: 0;\ni {\n                color: white !important;\n                font-size: 5rem !important;\n}\n}\n}\n}\n", ""]);

// exports


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue2_dropzone__ = __webpack_require__(17);
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

    data: function data() {
        return {
            csrfToken: document.head.querySelector('meta[name="csrf-token"]').content,
            csrfHeader: {
                'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
            },
            customOptions: {
                parallelUploads: 1,
                maxNumberOfFiles: 10,
                maxFileSizeInMB: 50,
                acceptedFileTypes: 'image/png, image/jpeg, image/jpg, image/tiff, image/heif, image/heic'
            }
        };
    },


    components: {
        Dropzone: __WEBPACK_IMPORTED_MODULE_0_vue2_dropzone___default.a
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
                data: imageDetails
            });
        },
        removeFile: function removeFile(file, error, xhr) {
            var photoId = file.previewElement.getAttribute('data-photo-id');

            axios.delete('/breeder/manage-swine/upload-photo/' + photoId).then(function (response) {}).catch(function (error) {
                console.log(error);
            });

            // Trigger removedPhotoEvent
            this.$emit('removedPhotoEvent', {
                photoId: photoId
            });
        },
        template: function template() {
            return '\n                <div class="dz-preview dz-file-preview">\n                    <div class="dz-image" style="width: 200px;height: 200px">\n                        <img data-dz-thumbnail />\n                    </div>\n                    <div class="dz-details">\n                        <div class="dz-size"><span data-dz-size></span></div>\n                        <div class="dz-filename"><span data-dz-name></span></div>\n                    </div>\n                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n                    <div class="dz-error-message"><span data-dz-errormessage></span></div>\n                    <div class="dz-success-mark"><i class="fa fa-check"></i></div>\n                    <div class="dz-error-mark"><i class="fa fa-close"></i></div>\n                </div>\n            ';
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 68 */
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
  }, [_vm._v("Upload Photos")]), _vm._v(" "), _c('div', {}, [_c('dropzone', {
    ref: "uploadDropzone",
    attrs: {
      "id": "uploadDropzone",
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
      "name": "token"
    },
    domProps: {
      "value": _vm.csrfToken
    }
  })])], 1)])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5bf32331", module.exports)
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
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(72),
  /* template */
  __webpack_require__(73),
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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("eab6435a", content, false);
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n.tab a.active[data-v-ee7fd1e0] {\n    color: #c62828 !important;\n}\n.tab.disabled a[data-v-ee7fd1e0] {\n    color: #9e9e9e !important;\n    cursor: not-allowed !important;\n}\n", ""]);

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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        farmoptions: Array,
        breeds: Array,
        uploadurl: String
    },

    data: function data() {
        return {
            tabDisables: {
                photos: true,
                summary: true
            },
            gpSireData: {},
            gpDamData: {},
            gpOneData: {},
            basicInfo: {
                id: 0,
                breed: '',
                sex: '',
                birthDate: '',
                dateCollected: '',
                farmFrom: ''
            },
            imageFiles: []
        };
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
            tabId === 'summary' ? this.tabDisables.summary = false : this.tabDisables.summary = true;

            this.$nextTick(function () {
                $('#add-swine-tabs ul.tabs').tabs('select_tab', tabId);
            });
        },
        getSireInfo: function getSireInfo(sireRegNo) {
            var vm = this;

            // Fetch from server Sire details
            axios.get('/breeder/manage-swine/get/' + sireRegNo).then(function (response) {
                // Put response in local data storage
                // and enable 'GP Sire' tab
                vm.gpSireData = response.data;
                vm.tabDisables.gpSire = false;

                Materialize.toast('Sire added', 2000);
            }).catch(function (error) {
                Materialize.toast('Unable to add Sire', 3000, 'amber lighten-3');
                console.log(error);
            });
        },
        getDamInfo: function getDamInfo(damRegNo) {
            var vm = this;

            // Fetch from server Dam details
            axios.get('/breeder/manage-swine/get/' + damRegNo).then(function (response) {
                // Put response in local data storage
                // and enable 'GP Dam' tab
                vm.gpDamData = response.data;
                vm.tabDisables.gpDam = false;

                Materialize.toast('Dam added', 2000);
            }).catch(function (error) {
                Materialize.toast('Unable to add Dam', 3000, 'amber lighten-3');
                console.log(error);
            });
        },
        getParents: function getParents(fetchDetails) {
            this.getSireInfo(fetchDetails.sireRegNo);
            this.getDamInfo(fetchDetails.damRegNo);
        },
        addSwineInfo: function addSwineInfo(gpOneDetails) {
            var vm = this;

            // Update parent component of GP1 details
            this.gpOneData = gpOneDetails.data;

            // Add to server's database
            axios.post('/breeder/manage-swine/register', {
                gpSireId: vm.gpSireData ? vm.gpSireData.id : null,
                gpDamId: vm.gpDamData ? vm.gpDamData.id : null,
                gpOne: vm.gpOneData,
                basicInfo: vm.basicInfo
            }).then(function (response) {
                // Put response in local data storage
                // and enable 'Photos' tab
                vm.basicInfo.id = response.data;
                vm.tabDisables.photos = false;

                Materialize.toast('Swine info added', 2000, 'green lighten-1');
            }).catch(function (error) {
                console.log(error);
            });
        },
        addPhotoToImageFiles: function addPhotoToImageFiles(imageDetails) {
            // Put information of uploaded photos in local data storage
            // and enable 'Summary' tab
            this.imageFiles.push(imageDetails.data);
            this.tabDisables.summary = false;
        },
        removePhotoFromImageFiles: function removePhotoFromImageFiles(imageDetails) {
            // Remove photo from local data storage
            // and check if 'Summary' tab
            // should still be enabled
            var index = this.getIndex(imageDetails.photoId, this.imageFiles);

            this.imageFiles.splice(index, 1);
            this.tabDisables.summary = this.imageFiles.length < 1 ? true : false;
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 73 */
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
        _vm.basicInfo.breed = val
      }
    },
    model: {
      value: (_vm.basicInfo.breed),
      callback: function($$v) {
        _vm.basicInfo.breed = $$v
      },
      expression: "basicInfo.breed"
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
        _vm.basicInfo.sex = val
      }
    },
    model: {
      value: (_vm.basicInfo.sex),
      callback: function($$v) {
        _vm.basicInfo.sex = $$v
      },
      expression: "basicInfo.sex"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.basicInfo.birthDate = val
      }
    },
    model: {
      value: (_vm.basicInfo.birthDate),
      callback: function($$v) {
        _vm.basicInfo.birthDate = $$v
      },
      expression: "basicInfo.birthDate"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Birth Date ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-date', {
    on: {
      "date-select": function (val) {
        _vm.basicInfo.dateCollected = val
      }
    },
    model: {
      value: (_vm.basicInfo.dateCollected),
      callback: function($$v) {
        _vm.basicInfo.dateCollected = $$v
      },
      expression: "basicInfo.dateCollected"
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": ""
    }
  }, [_vm._v(" Date when data was collected ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "input-field col s12"
  }, [_c('app-input-select', {
    attrs: {
      "labelDescription": "Farm From",
      "options": _vm.farmoptions
    },
    on: {
      "select": function (val) {
        _vm.basicInfo.farmFrom = val
      }
    },
    model: {
      value: (_vm.basicInfo.farmFrom),
      callback: function($$v) {
        _vm.basicInfo.farmFrom = $$v
      },
      expression: "basicInfo.farmFrom"
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
      "basic-info": _vm.basicInfo,
      "gp-one-data": _vm.gpOneData,
      "gp-sire": _vm.gpSireData.registration_no,
      "gp-dam": _vm.gpDamData.registration_no,
      "image-files": _vm.imageFiles,
      "breeds": _vm.breeds,
      "farmoptions": _vm.farmoptions
    }
  }), _vm._v(" "), _c('register-swine-upload-photo', {
    attrs: {
      "swine-id": _vm.basicInfo.id,
      "uploadurl": _vm.uploadurl
    },
    on: {
      "addedPhotoEvent": _vm.addPhotoToImageFiles,
      "removedPhotoEvent": _vm.removePhotoFromImageFiles
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(75)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(77),
  /* template */
  __webpack_require__(78),
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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(76);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("6f86576b", content, false);
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
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n.switch label i {\n    margin: 0;\n}\n.card-image {\n    background-color: white;\n}\n.card-image img {\n    margin: 0 auto;\n\twidth: auto;\n\tpadding: 0.5rem;\n}\n\n/* Medium Screen */\n@media only screen and (min-width: 601px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 160px;\n}\n}\n\n/* Large Screen */\n@media only screen and (min-width: 993px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 168px;\n}\n}\n\n/* Extra Large Screen */\n@media only screen and (min-width: 1100px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 180px;\n}\n}\n\n/* Super Extra Large Screen */\n@media only screen and (min-width: 1560px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 210px;\n}\n}\n\n/* Super Super Extra Large Screen */\n@media only screen and (min-width: 1560px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 270px;\n}\n}\n\n", ""]);

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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        swines: Array
    },

    data: function data() {
        return {
            swinePhotosDirectory: '/storage/images/swine/',
            certificatePhotosDirectory: '/storage/images/certificate/',
            viewLayout: 'card',
            viewCertificateModal: {
                swineName: '',
                imageSrc: ''
            },
            viewPhotosModal: {
                photos: []
            }
        };
    },


    methods: {
        viewCertificate: function viewCertificate(index) {
            // Prepare needed data for modal
            this.viewCertificateModal.swineName = this.swines[index].registration_no;
            this.viewCertificateModal.imageSrc = this.certificatePhotosDirectory + this.swines[index].certificate.photos[0].name;

            $('#view-certificate-modal').modal('open');
        },
        viewPhotos: function viewPhotos(index) {
            // Prepare needed data for modal
            this.viewPhotosModal.photos = this.swines[index].photos;

            $('#view-photos-modal').modal('open');
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "switch right"
  }, [_c('label', [_c('i', {
    staticClass: "material-icons left"
  }, [_vm._v("view_module")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.viewLayout),
      expression: "viewLayout"
    }],
    attrs: {
      "type": "checkbox",
      "true-value": 'list',
      "false-value": 'card'
    },
    domProps: {
      "checked": Array.isArray(_vm.viewLayout) ? _vm._i(_vm.viewLayout, null) > -1 : _vm._q(_vm.viewLayout, 'list')
    },
    on: {
      "__c": function($event) {
        var $$a = _vm.viewLayout,
          $$el = $event.target,
          $$c = $$el.checked ? ('list') : ('card');
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.viewLayout = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.viewLayout = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.viewLayout = $$c
        }
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "lever"
  }), _vm._v(" "), _c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("list")])])])]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "card-layout-container"
    }
  }, _vm._l((_vm.swines), function(swine, index) {
    return _c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.viewLayout === 'card'),
        expression: "viewLayout === 'card'"
      }],
      key: swine.id,
      staticClass: "col s4"
    }, [_c('div', {
      staticClass: "card"
    }, [_c('div', {
      staticClass: "card-image"
    }, [_c('img', {
      staticClass: "materialboxed",
      attrs: {
        "src": _vm.swinePhotosDirectory + swine.photos[0].name
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "card-content"
    }, [_c('span', {
      staticClass: "card-title"
    }, [_vm._v(_vm._s(swine.registration_no))]), _vm._v(" "), _c('p', {
      staticClass: "grey-text"
    }, [_vm._v("\n                        " + _vm._s(swine.farm.name) + ", " + _vm._s(swine.farm.province) + " "), _c('br'), _vm._v(" "), _c('br'), _vm._v("\n                        " + _vm._s(swine.breed.title) + " (" + _vm._s(swine.swine_properties[0].value) + ")\n                    ")])]), _vm._v(" "), _c('div', {
      staticClass: "card-action"
    }, [_c('a', {
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.viewCertificate(index)
        }
      }
    }, [_vm._v("\n                        Certificate\n                    ")]), _vm._v(" "), _c('a', {
      staticClass: "right",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.viewPhotos(index)
        }
      }
    }, [_vm._v("\n                        Photos\n                    ")])])])])
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
  }, _vm._l((_vm.swines), function(swine, index) {
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
    }, [_vm._v(_vm._s(swine.registration_no))]), _vm._v(" "), _c('p', {
      staticClass: "grey-text"
    }, [_vm._v("\n                    " + _vm._s(swine.farm.name) + ", " + _vm._s(swine.farm.province) + " "), _c('br'), _vm._v("\n                    " + _vm._s(swine.breed.title) + " (" + _vm._s(swine.swine_properties[0].value) + ")\n                ")]), _vm._v(" "), _c('div', {
      staticClass: "secondary-content"
    }, [_c('a', {
      staticClass: "btn-flat orange-text text-accent-2",
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.viewCertificate(index)
        }
      }
    }, [_vm._v("\n                        Certificate\n                    ")]), _vm._v(" "), _c('a', {
      staticClass: "btn-flat orange-text text-accent-2",
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.viewPhotos(index)
        }
      }
    }, [_vm._v("\n                        Photos\n                    ")])])])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "view-certificate-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-image"
  }, [_c('img', {
    attrs: {
      "src": _vm.viewCertificateModal.imageSrc
    }
  })])])])]), _vm._v(" "), _vm._m(2)]), _vm._v(" "), _c('div', {
    staticClass: "modal bottom-sheet",
    attrs: {
      "id": "view-photos-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_vm._m(3), _vm._v(" "), _c('div', {
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
  }))]), _vm._v(" "), _vm._m(4)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('h4', {
    staticClass: "title-page"
  }, [_vm._v(" View Registered Swine ")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("Certificate "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal-footer"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect waves-green btn-flat",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h4', [_vm._v("Photos "), _c('i', {
    staticClass: "material-icons right modal-close"
  }, [_vm._v("close")])])
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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(80)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(82),
  /* template */
  __webpack_require__(83),
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
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(81);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("84fa81c4", content, false);
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
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n.collection-header a[data-v-63d665c6], .edit-breed-button[data-v-63d665c6], #close-add-breed-container-button[data-v-63d665c6] {\n    cursor: pointer;\n}\n.collection-item .row[data-v-63d665c6] {\n    margin-bottom: 0;\n}\n#edit-breed-modal[data-v-63d665c6] {\n    width: 30rem;\n    height: 20rem;\n}\n\n", ""]);

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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: {
        initialBreeds: Array
    },

    data: function data() {
        return {
            breeds: this.initialBreeds,
            showAddBreedInput: false,
            addBreedData: {
                title: ''
            },
            editBreedData: {
                index: -1,
                id: 0,
                title: ''
            }
        };
    },


    methods: {
        toggleAddBreedContainer: function toggleAddBreedContainer() {
            this.showAddBreedInput = !this.showAddBreedInput;
        },
        addBreed: function addBreed() {
            var vm = this;

            // Add to server's database
            axios.post('/admin/manage/breeds', {
                title: vm.addBreedData.title
            }).then(function (response) {
                // Put response in local data storage and erase adding of breed data
                vm.breeds.push(response.data);
                vm.addBreedData.title = '';

                // Update UI after adding breed
                vm.$nextTick(function () {
                    $('#breed-title').removeClass('valid');

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

            $('#edit-breed-modal').modal('open');
            this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        },
        updateBreed: function updateBreed() {
            var vm = this;
            var index = this.editBreedData.index;

            // Update to server's database
            axios.patch('/admin/manage/breeds', {
                breedId: vm.editBreedData.id,
                title: vm.editBreedData.title
            }).then(function (response) {
                // Update local data storage and erase editing of breed data
                if (response.data === 'OK') {
                    vm.breeds[index].title = vm.editBreedData.title;
                    vm.editBreedData = {
                        index: -1,
                        id: 0,
                        title: ''
                    };
                }

                // Update UI after updating breed
                vm.$nextTick(function () {
                    $('#edit-breed-modal').modal('close');
                    $('#edit-breed-title').removeClass('valid');

                    Materialize.updateTextFields();
                    Materialize.toast('Breed updated', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    },

    mounted: function mounted() {
        // Materialize component initializations
        $('.modal').modal();
    }
});

/***/ }),
/* 83 */
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
    staticClass: "collection-item"
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
        _vm.addBreedData.title = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "breed-title"
    }
  }, [_vm._v("Breed Title")])]), _vm._v(" "), _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('a', {
    staticClass: "right btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addBreed()
      }
    }
  }, [_vm._v("\n                            Submit\n                            "), _c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("send")])])])])]), _vm._v(" "), _vm._l((_vm.breeds), function(breed, index) {
    return _c('li', {
      key: breed.id,
      staticClass: "collection-item"
    }, [_vm._v("\n                " + _vm._s(breed.title) + "\n                "), _c('span', [_c('a', {
      staticClass: "secondary-content edit-breed-button light-blue-text text-darken-1",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleEditBreedModal(index)
        }
      }
    }, [_c('i', {
      staticClass: "material-icons"
    }, [_vm._v("edit")])])])])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "edit-breed-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_c('h4', [_vm._v("Edit Breed")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
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
        _vm.editBreedData.title = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-breed-title"
    }
  }, [_vm._v("Breed Title")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect waves-green btn-flat ",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action waves-effect waves-green btn-flat",
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
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-63d665c6", module.exports)
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
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(87),
  /* template */
  __webpack_require__(88),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
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
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(86);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("54278d57", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0e4e505e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageProperties.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0e4e505e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./ManageProperties.vue");
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

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n.collection-header a, .edit-property-button, #close-add-property-container-button {\n    cursor: pointer;\n}\n.collection-item .row {\n    margin-bottom: 0;\n}\n.collection-item.avatar {\n    padding-left: 20px !important;\n}\n#edit-property-modal {\n    width: 30rem;\n    height: 35rem;\n}\n\n", ""]);

// exports


/***/ }),
/* 87 */
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
        addProperty: function addProperty() {
            var vm = this;

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
        updateProperty: function updateProperty() {
            var vm = this;
            var index = this.editPropertyData.index;

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

                    Materialize.updateTextFields();
                    Materialize.toast('Property updated', 2000, 'green lighten-1');
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    },

    mounted: function mounted() {
        var _this = this;

        // Materialize component initializations
        $('.modal').modal();

        // Watch the respective property to produce a default slug
        this.$watch('addPropertyData.property', function (newValue) {
            _this.addPropertyData.slug = _.snakeCase(newValue);
            _this.$nextTick(function () {
                Materialize.updateTextFields();
            });
        });
    }
});

/***/ }),
/* 88 */
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
    staticClass: "collection-item"
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
        _vm.addPropertyData.property = $event.target.value
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
        _vm.addPropertyData.slug = $event.target.value
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
        _vm.addPropertyData.definition = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-definition"
    }
  }, [_vm._v("Definition")])]), _vm._v(" "), _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('a', {
    staticClass: "right btn",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addProperty()
      }
    }
  }, [_vm._v("\n                            Submit\n                            "), _c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("send")])])])])]), _vm._v(" "), _vm._l((_vm.properties), function(property, index) {
    return _c('li', {
      staticClass: "collection-item avatar"
    }, [_c('span', {
      staticClass: "title"
    }, [_vm._v(" " + _vm._s(property.property) + " ")]), _vm._v(" "), _c('p', {
      staticClass: "grey-text"
    }, [_vm._v("\n                    Slug: " + _vm._s(property.slug) + " "), _c('br'), _vm._v("\n                    Definition: " + _vm._s(property.definition) + "\n                ")]), _vm._v(" "), _c('a', {
      staticClass: "secondary-content edit-property-button light-blue-text text-darken-1",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleEditPropertyModal(index)
        }
      }
    }, [_c('i', {
      staticClass: "material-icons"
    }, [_vm._v("edit")])])])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "edit-property-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_c('h4', [_vm._v("Edit Property")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
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
        _vm.editPropertyData.property = $event.target.value
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
        _vm.editPropertyData.slug = $event.target.value
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
        _vm.editPropertyData.definition = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-definition"
    }
  }, [_vm._v("Definition")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect waves-green btn-flat ",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action waves-effect waves-green btn-flat",
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
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0e4e505e", module.exports)
  }
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(90)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(92),
  /* template */
  __webpack_require__(93),
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
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("8717e40a", content, false);
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
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)(undefined);
// imports


// module
exports.push([module.i, "\n.collection-header a[data-v-13cd11b7],\n.edit-property-button[data-v-13cd11b7],\n#close-add-credentials-container-button[data-v-13cd11b7],\n#show-help-info-button[data-v-13cd11b7],\n#close-help-info-button[data-v-13cd11b7] {\n    cursor: pointer;\n}\n.collection-item.avatar[data-v-13cd11b7] {\n    padding-left: 20px !important;\n}\n#edit-credentials-modal[data-v-13cd11b7] {\n    width: 50rem;\n    height: 25rem;\n}\n#delete-credentials-modal[data-v-13cd11b7] {\n    width: 40rem;\n    height: 23rem;\n}\nblockquote.error[data-v-13cd11b7]{\n\tborder-left: 5px solid #ee6e73;\n\tbackground-color: #fdf0f1;\n}\n\n", ""]);

// exports


/***/ }),
/* 92 */
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

                    _this2.enableButtons(addButtons, event.target, 'Submit <i class="material-icons right">send</i>');

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
/* 93 */
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
    staticClass: "collection-item"
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
        _vm.addCredentialsData.name = $event.target.value
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
        _vm.addCredentialsData.redirect = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "add-credentials-redirect"
    }
  }, [_vm._v("Redirect")])]), _vm._v(" "), _c('div', {
    staticClass: "col s4 offset-s4"
  }, [_c('a', {
    staticClass: "right btn add-credentials-button",
    attrs: {
      "href": "#!"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.addCredentials($event)
      }
    }
  }, [_vm._v("\n                                Submit\n                                "), _c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("send")])])])])]), _vm._v(" "), (_vm.clients.length < 1) ? [_vm._m(2)] : _vm._l((_vm.clients), function(client, index) {
    return _c('li', {
      staticClass: "collection-item avatar"
    }, [_c('span', {
      staticClass: "title"
    }, [_vm._v(" " + _vm._s(client.name) + " ")]), _vm._v(" "), _c('p', {
      staticClass: "grey-text"
    }, [_vm._v("\n                            CLIENT_ID: " + _vm._s(client.id) + " "), _c('br'), _vm._v("\n                            CLIENT_SECRET: " + _vm._s(client.secret) + " "), _c('br'), _vm._v("\n                            Redirect: " + _vm._s(client.redirect) + "\n                        ")]), _vm._v(" "), _c('span', {
      staticClass: "secondary-content"
    }, [_c('a', {
      staticClass: "edit-credentials-button",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleEditCredentialsModal(index)
        }
      }
    }, [_c('i', {
      staticClass: "material-icons"
    }, [_vm._v("edit")])]), _vm._v(" "), _c('a', {
      staticClass: "delete-credentials-button red-text text-lighten-2",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.toggleDeleteCredentialsModal(index)
        }
      }
    }, [_c('i', {
      staticClass: "material-icons"
    }, [_vm._v("delete")])])])])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "modal modal-fixed-footer",
    attrs: {
      "id": "edit-credentials-modal"
    }
  }, [_c('div', {
    staticClass: "modal-content"
  }, [_c('h4', [_vm._v("Edit Credentials")]), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
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
        _vm.editCredentialsData.name = $event.target.value
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
        _vm.editCredentialsData.redirect = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "edit-credentials-redirect"
    }
  }, [_vm._v("Redirect")])])])]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect waves-green btn-flat update-credentials-button",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action waves-effect waves-green btn-flat update-credentials-button",
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
  }, [_c('h4', [_vm._v("Delete Credentials")]), _vm._v(" "), _c('p'), _c('blockquote', {
    staticClass: "error"
  }, [_vm._v("\n                        THIS ACTION CANNOT BE UNDONE.\n                    ")]), _vm._v("\n                    Are you sure you want to delete credentials for "), _c('b', [_vm._v(_vm._s(_vm.deleteCredentialsData.name))]), _vm._v("? "), _c('br'), _vm._v(" "), _c('p')]), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_c('a', {
    staticClass: "modal-action modal-close waves-effect waves-green btn-flat delete-credentials-button",
    attrs: {
      "href": "#!"
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c('a', {
    staticClass: "modal-action waves-effect waves-green btn-flat delete-credentials-button",
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
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-13cd11b7", module.exports)
  }
}

/***/ }),
/* 94 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[18]);