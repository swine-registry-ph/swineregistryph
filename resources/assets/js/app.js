
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('custom-input-select', require('./components/CustomInputSelect.vue'));
Vue.component('custom-input-date', require('./components/CustomInputDate.vue'));
Vue.component('upload-photo', require('./components/UploadPhoto.vue'));
Vue.component('swine-properties', require('./components/SwineProperties.vue'));
Vue.component('collection', require('./components/Collection.vue'));

// For main container
const app = new Vue({
    el: '#app'
});

// For header container
const nav = new Vue({
    el: '#custom-nav',

    mounted() {
        // Initialize side navigation
        $(".button-collapse").sideNav();
    }
});
