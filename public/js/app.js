webpackJsonp([1],[
/* 0 */,
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
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
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
module.exports = __webpack_require__(70);


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

Vue.component('custom-input-select', __webpack_require__(42));
Vue.component('custom-input-date', __webpack_require__(45));
Vue.component('upload-photo', __webpack_require__(48));
Vue.component('swine-properties', __webpack_require__(54));
Vue.component('add-swine-summary', __webpack_require__(57));
Vue.component('collection', __webpack_require__(60));
Vue.component('registered-swine', __webpack_require__(65));

// For main container
var app = new Vue({
    el: '#app'
});

// For header container
var nav = new Vue({
    el: '#custom-nav',

    mounted: function mounted() {
        // Initialize side navigation
        $(".button-collapse").sideNav();
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
  window.$ = window.jQuery = __webpack_require__(2);

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
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/CustomInputSelect.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] CustomInputSelect.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d1f3eea8", Component.options)
  } else {
    hotAPI.reload("data-v-d1f3eea8", Component.options)
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
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['value', 'options', 'labelDescription'],

    data: function data() {
        return {
            hideLabel: false
        };
    },
    mounted: function mounted() {
        // Initialize Material select
        $(this.$refs.select).material_select();

        // Bind change event to emit new value
        var self = this;

        $(this.$refs.select).on('change', function () {
            self.$emit('select', self.$refs.select.value);

            // Show label upon value change
            self.hideLabel = true;
        });
    }
});

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {}, [_c('select', {
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
     require("vue-hot-reload-api").rerender("data-v-d1f3eea8", module.exports)
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
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/CustomInputDate.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] CustomInputDate.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-30fa005e", Component.options)
  } else {
    hotAPI.reload("data-v-30fa005e", Component.options)
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['value'],

    mounted: function mounted() {
        // Initialize datepicker
        $(this.$refs.dateSelect).pickadate({
            max: true,
            selectMonths: true,
            selectYears: 3,
            format: 'mmmm d, yyyy'
        });

        // Bind change event to emit new value
        var self = this;

        $(this.$refs.dateSelect).on('change', function () {
            self.$emit('date-select', self.$refs.dateSelect.value);
        });
    }
});

/***/ }),
/* 47 */
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
     require("vue-hot-reload-api").rerender("data-v-30fa005e", module.exports)
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
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/UploadPhoto.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] UploadPhoto.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ba37d30", Component.options)
  } else {
    hotAPI.reload("data-v-4ba37d30", Component.options)
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
var update = __webpack_require__(5)("65934be6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4ba37d30\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UploadPhoto.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4ba37d30\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./UploadPhoto.vue");
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

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Custom style from vue-dropzone */\n.vue-dropzone {\n    min-height: 20rem;\n    border: 2px solid #000000;\n    font-family: inherit;\n    letter-spacing: 0.2px;\n    color: #777;\n    transition: background-color .2s linear;\n&:hover {\n        background-color: #F6F6F6;\n}\ni {\n        color: #CCC;\n}\n.dz-preview {\n.dz-image {\n            border-radius: 1;\n&:hover {\nimg {\n                    transform: none;\n                    -webkit-filter: none;\n}\n}\n}\n.dz-details {\n            bottom: 0;\n            top: 0;\n            color: white;\n            background-color: rgba(33, 150, 243, 0.8);\n            transition: opacity .2s linear;\n            text-align: left;\n.dz-filename span, .dz-size span {\n                background-color: transparent;\n}\n.dz-filename:not(:hover) span {\n                border: none;\n}\n.dz-filename:hover span {\n                background-color: transparent;\n                border: none;\n}\n}\n.dz-progress .dz-upload {\n            background: #cccccc;\n}\n.dz-remove {\n            position: absolute;\n            z-index: 30;\n            color: white;\n            margin-left: 15px;\n            padding: 10px;\n            top: inherit;\n            bottom: 15px;\n            border: 2px white solid;\n            text-decoration: none;\n            text-transform: uppercase;\n            font-size: 0.8rem;\n            font-weight: 800;\n            letter-spacing: 1.1px;\n            opacity: 0;\n}\n&:hover {\n.dz-remove {\n                opacity: 1;\n}\n}\n.dz-success-mark, .dz-error-mark {\n            margin-left: auto !important;\n            margin-top: auto !important;\n            width: 100% !important;\n            top: 35% !important;\n            left: 0;\ni {\n                color: white !important;\n                font-size: 5rem !important;\n}\n}\n}\n}\n", ""]);

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
    props: ['swineId', 'uploadurl'],

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
/* 53 */
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
     require("vue-hot-reload-api").rerender("data-v-4ba37d30", module.exports)
  }
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(55),
  /* template */
  __webpack_require__(56),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/SwineProperties.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] SwineProperties.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3baec0f4", Component.options)
  } else {
    hotAPI.reload("data-v-3baec0f4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 55 */
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['category', 'data'],

    data: function data() {
        return {
            parents: {
                sireRegNo: '',
                damRegNo: ''
            },
            gpOne: {
                adg: '',
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


    computed: {
        categoryWithDash: function categoryWithDash() {
            return this.category + '-';
        },
        titleCategory: function titleCategory() {
            return _.toUpper(this.category);
        }
    },

    methods: {
        objectIsEmpty: function objectIsEmpty(obj) {
            return _.isEmpty(obj);
        },
        triggerGetParentsEvent: function triggerGetParentsEvent() {
            this.$emit('getParentsEvent', {
                sireRegNo: this.parents.sireRegNo,
                damRegNo: this.parents.damRegNo
            });
        },
        triggerSubmitSwineInfoEvent: function triggerSubmitSwineInfoEvent() {
            this.$emit('submitSwineInfoEvent', {
                data: this.gpOne
            });
        }
    },

    mounted: function mounted() {
        console.log('Component mounted.');
    }
});

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "row",
    attrs: {
      "id": _vm.category
    }
  }, [_c('div', {
    staticClass: "card col s12"
  }, [_c('div', {
    staticClass: "card-content"
  }, [_c('span', {
    staticClass: "card-title center-align"
  }, [_vm._v(_vm._s(_vm.titleCategory))]), _vm._v(" "), (_vm.data) ? _c('div', [(_vm.objectIsEmpty(_vm.data)) ? _c('div', {}, [_c('p', [_vm._v(" No data available. ")])]) : _c('div', {}, [_c('table', {
    staticClass: "striped"
  }, [_vm._m(0), _vm._v(" "), _c('tbody', _vm._l((_vm.data.swine_properties), function(property) {
    return _c('tr', [_c('td', [_vm._v(" " + _vm._s(property.title) + " ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(property.value) + " ")])])
  }))])])]) : _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.parents.sireRegNo),
      expression: "parents.sireRegNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.categoryWithDash + 'gpSire',
      "type": "text"
    },
    domProps: {
      "value": (_vm.parents.sireRegNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.parents.sireRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.categoryWithDash + 'gpSire'
    }
  }, [_vm._v("GP Sire (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.parents.damRegNo),
      expression: "parents.damRegNo"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.categoryWithDash + 'gpDam',
      "type": "text"
    },
    domProps: {
      "value": (_vm.parents.damRegNo)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.parents.damRegNo = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.categoryWithDash + 'gpDam'
    }
  }, [_vm._v("GP Dam (optional)")])]), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('button', {
    staticClass: "btn waves-effect waves-light right",
    attrs: {
      "type": "submit",
      "name": "action"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.triggerGetParentsEvent()
      }
    }
  }, [_vm._v("\n                        Add Parents "), _c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("add")])])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gpOne.adg),
      expression: "gpOne.adg"
    }],
    staticClass: "validate",
    attrs: {
      "id": _vm.categoryWithDash + 'adg',
      "type": "text"
    },
    domProps: {
      "value": (_vm.gpOne.adg)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gpOne.adg = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": _vm.categoryWithDash + 'adg'
    }
  }, [_vm._v("Average Daily Gain (g/day)")])]), _vm._v(" "), _c('div', {
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
      "id": _vm.categoryWithDash + 'bft',
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
      "for": _vm.categoryWithDash + 'bft'
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
      "id": _vm.categoryWithDash + 'feed-efficiency',
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
      "for": _vm.categoryWithDash + 'feed-efficiency'
    }
  }, [_vm._v("Feed Efficiency (gain/feed)")])]), _vm._v(" "), _c('div', {
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
      "id": _vm.categoryWithDash + 'birth-weight',
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
      "for": _vm.categoryWithDash + 'birth-weight'
    }
  }, [_vm._v("Birth weight")])]), _vm._v(" "), _c('div', {
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
      "id": _vm.categoryWithDash + 'total-m',
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
      "for": _vm.categoryWithDash + 'total-m'
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
      "id": _vm.categoryWithDash + 'total-f',
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
      "for": _vm.categoryWithDash + 'total-f'
    }
  }, [_vm._v("Total (F) born alive")])]), _vm._v(" "), _c('div', {
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
      "id": _vm.categoryWithDash + 'parity',
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
      "for": _vm.categoryWithDash + 'parity'
    }
  }, [_vm._v("Parity")])]), _vm._v(" "), _c('div', {
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
      "id": _vm.categoryWithDash + 'littersize-weaning',
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
      "for": _vm.categoryWithDash + 'littersize-weaning'
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
      "id": _vm.categoryWithDash + 'litterweight-weaning',
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
      "for": _vm.categoryWithDash + 'litterweight-weaning'
    }
  }, [_vm._v("Litter weight at weaning")])]), _vm._v(" "), _c('div', {
    staticClass: "col s6 input-field"
  }, [_c('custom-input-date', {
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
  }, [_vm._v(" Date at weaning ")])], 1), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('button', {
    staticClass: "btn waves-effect waves-light right",
    attrs: {
      "type": "submit",
      "name": "action"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.triggerSubmitSwineInfoEvent($event)
      }
    }
  }, [_vm._v("\n                        Submit Info "), _c('i', {
    staticClass: "material-icons right"
  }, [_vm._v("send")])])])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', [_c('tr', [_c('th', [_vm._v(" Property ")]), _vm._v(" "), _c('th', [_vm._v(" Value ")])])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3baec0f4", module.exports)
  }
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(58),
  /* template */
  __webpack_require__(59),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/AddSwineSummary.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] AddSwineSummary.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b7c16fc", Component.options)
  } else {
    hotAPI.reload("data-v-2b7c16fc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 58 */
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['basicInfo', 'gpOneData', 'gpSire', 'gpDam', 'imageFiles'],

    data: function data() {
        return {
            summaryImageFiles: this.imageFiles,
            currentPrimaryPhotoIndex: -1
        };
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
/* 59 */
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
  }, [_vm._v("Summary")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "col s12"
  }, [_c('table', {
    staticClass: "striped"
  }, [_vm._m(1), _vm._v(" "), _c('tbody', [_c('tr', [_c('td', [_vm._v(" Breed ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.breed) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Sex ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.sex) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Date ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.birthDate) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Weight when data was collected ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.weight) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Farm From ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.farmFrom) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date collected ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.basicInfo.dateCollected) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" GP Sire ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpSire) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" GP Dam ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpDam) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Average Daily Gain ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.adg) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Backfat Thickness ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.bft) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Feed Efficiency ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.fe) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Birth Weight ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.birth_weight) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (M) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersizeAlive_male) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total (F) born alive ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersizeAlive_female) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Parity ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.parity) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Littersize at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.littersize_weaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Total litterweight at weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.litterweight_weaning) + " ")])]), _vm._v(" "), _c('tr', [_c('td', [_vm._v(" Date at Weaning ")]), _vm._v(" "), _c('td', [_vm._v(" " + _vm._s(_vm.gpOneData.date_weaning) + " ")])])])])]), _vm._v(" "), _vm._m(2), _vm._v(" "), _vm._l((_vm.summaryImageFiles), function(photo) {
    return _c('div', {
      staticClass: "col s6"
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
    }, [_vm._v("photo")]), _vm._v(" Primary Photo\n                        ")]) : _c('a', {
      attrs: {
        "href": "#!"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.setAsPrimaryPhoto(photo.id)
        }
      }
    }, [_vm._v("\n                            Set as Primary\n                        ")])])])])
  }), _vm._v(" "), _vm._m(3)], 2)])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_vm._v("Information")]), _vm._v(" "), _c('div', {
    staticClass: "divider"
  }), _vm._v(" "), _c('p', [_c('br')])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('thead', [_c('tr', [_c('th', [_vm._v(" Property ")]), _vm._v(" "), _c('th', [_vm._v(" Value ")])])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_vm._v("Photos")]), _vm._v(" "), _c('div', {
    staticClass: "divider"
  }), _vm._v(" "), _c('p', [_c('br')])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('h6', [_vm._v("Breed Registry Certificate")]), _vm._v(" "), _c('div', {
    staticClass: "divider"
  }), _vm._v(" "), _c('p', [_c('br')])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2b7c16fc", module.exports)
  }
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(61)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(63),
  /* template */
  __webpack_require__(64),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/Collection.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Collection.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a2e8c892", Component.options)
  } else {
    hotAPI.reload("data-v-a2e8c892", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(62);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("19c472a0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a2e8c892\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Collection.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a2e8c892\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Collection.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.tab a.active {\n    color: #c62828 !important;\n}\n.tab.disabled a {\n    color: #9e9e9e !important;\n    cursor: not-allowed !important;\n}\n", ""]);

// exports


/***/ }),
/* 63 */
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

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['farmoptions', 'breeds', 'uploadurl'],

    data: function data() {
        return {
            tabDisables: {
                gpSire: true,
                gpDam: true,
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
                weight: '',
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
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s10 offset-s1"
  }, [_c('div', {
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
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('li', {
    staticClass: "tab col s2",
    class: {
      'disabled': _vm.tabDisables.gpSire
    }
  }, [_c('a', {
    attrs: {
      "href": "#gp-sire"
    }
  }, [_vm._v("GP Sire")])]), _vm._v(" "), _c('li', {
    staticClass: "tab col s2",
    class: {
      'disabled': _vm.tabDisables.gpDam
    }
  }, [_c('a', {
    attrs: {
      "href": "#gp-dam"
    }
  }, [_vm._v("GP Dam")])]), _vm._v(" "), _c('li', {
    staticClass: "tab col s2",
    class: {
      'disabled': _vm.tabDisables.photos
    }
  }, [_c('a', {
    attrs: {
      "href": "#photos"
    }
  }, [_vm._v("Photos")])]), _vm._v(" "), _c('li', {
    staticClass: "tab col s2",
    class: {
      'disabled': _vm.tabDisables.summary
    }
  }, [_c('a', {
    attrs: {
      "href": "#summary"
    }
  }, [_vm._v("Summary")])])])])]), _vm._v(" "), _c('div', {
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
  }, [_vm._v("Basic Information")]), _vm._v(" "), _c('p', {
    staticClass: "row"
  }), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('custom-input-select', {
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
    staticClass: "input-field col s6"
  }, [_c('custom-input-select', {
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
    staticClass: "input-field col s6"
  }, [_c('custom-input-date', {
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
    staticClass: "input-field col s6"
  }, [_c('custom-input-date', {
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
    staticClass: "input-field col s6"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.basicInfo.weight),
      expression: "basicInfo.weight"
    }],
    staticClass: "validate",
    attrs: {
      "id": "weight",
      "type": "text"
    },
    domProps: {
      "value": (_vm.basicInfo.weight)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.basicInfo.weight = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "weight"
    }
  }, [_vm._v("Weight when data was collected")])]), _vm._v(" "), _c('div', {
    staticClass: "input-field col s6"
  }, [_c('custom-input-select', {
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
  })], 1), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('p')])])]), _vm._v(" "), _c('swine-properties', {
    attrs: {
      "category": "gp-1",
      "data": ""
    },
    on: {
      "getParentsEvent": _vm.getParents,
      "submitSwineInfoEvent": _vm.addSwineInfo
    }
  }), _vm._v(" "), _c('swine-properties', {
    attrs: {
      "category": "gp-sire",
      "data": _vm.gpSireData
    }
  }), _vm._v(" "), _c('swine-properties', {
    attrs: {
      "category": "gp-dam",
      "data": _vm.gpDamData
    }
  }), _vm._v(" "), _c('upload-photo', {
    attrs: {
      "swine-id": _vm.basicInfo.id,
      "uploadurl": _vm.uploadurl
    },
    on: {
      "addedPhotoEvent": _vm.addPhotoToImageFiles,
      "removedPhotoEvent": _vm.removePhotoFromImageFiles
    }
  }), _vm._v(" "), _c('add-swine-summary', {
    attrs: {
      "basic-info": _vm.basicInfo,
      "gp-one-data": _vm.gpOneData,
      "gp-sire": _vm.gpSireData.registration_no,
      "gp-dam": _vm.gpDamData.registration_no,
      "image-files": _vm.imageFiles
    }
  })], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "tab col s3"
  }, [_c('a', {
    attrs: {
      "href": "#basic-information"
    }
  }, [_vm._v("Basic Information")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "tab col s1"
  }, [_c('a', {
    attrs: {
      "href": "#gp-1"
    }
  }, [_vm._v("GP1")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('br')])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-a2e8c892", module.exports)
  }
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(66)
}
var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(68),
  /* template */
  __webpack_require__(69),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/var/www/breedregistry/resources/assets/js/components/RegisteredSwine.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] RegisteredSwine.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4eff535e", Component.options)
  } else {
    hotAPI.reload("data-v-4eff535e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(5)("e23056ce", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4eff535e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisteredSwine.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4eff535e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./RegisteredSwine.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "\n.switch label i {\n    margin: 0;\n}\n.card-image {\n    background-color: white;\n}\n.card-image img {\n    margin: 0 auto;\n\twidth: auto;\n\tpadding: 0.5rem;\n}\n\n/* Medium Screen */\n@media only screen and (min-width: 601px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 160px;\n}\n}\n\n/* Large Screen */\n@media only screen and (min-width: 993px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 168px;\n}\n}\n\n/* Extra Large Screen */\n@media only screen and (min-width: 1100px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 180px;\n}\n}\n\n/* Super Extra Large Screen */\n@media only screen and (min-width: 1560px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 210px;\n}\n}\n\n/* Super Super Extra Large Screen */\n@media only screen and (min-width: 1560px){\n    /* Image resize */\n#card-layout-container .card-image img {\n        height: 270px;\n}\n}\n\n", ""]);

// exports


/***/ }),
/* 68 */
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
    props: ['swines'],

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
/* 69 */
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
  }, [_c('p', [_c('br')])])
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
     require("vue-hot-reload-api").rerender("data-v-4eff535e", module.exports)
  }
}

/***/ }),
/* 70 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[18]);