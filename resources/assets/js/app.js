
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

// Import store file for vuex
import store from './store';

// App
Vue.component('app-input-date', require('./components/AppInputDate.vue'));
Vue.component('app-input-select', require('./components/AppInputSelect.vue'));

// Breeder
Vue.component('register-swine-parents-properties-inputs', require('./components/RegisterSwineParentsPropertiesInputs.vue'));
Vue.component('register-swine-parents-properties', require('./components/RegisterSwineParentsProperties.vue'));
Vue.component('register-swine-properties', require('./components/RegisterSwineProperties.vue'));
Vue.component('register-swine-summary', require('./components/RegisterSwineSummary.vue'));
Vue.component('register-swine-upload-photo', require('./components/RegisterSwineUploadPhoto.vue'));
Vue.component('register-swine', require('./components/RegisterSwine.vue'));
Vue.component('view-registered-swine', require('./components/ViewRegisteredSwine.vue'));

// Admin
Vue.component('manage-breeds', require('./components/ManageBreeds.vue'));
Vue.component('manage-properties', require('./components/ManageProperties.vue'));
Vue.component('manage-apis', require('./components/ManageAPIs.vue'));

// For main container
const app = new Vue({
    el: '#app',
    store
});

// For header container
const nav = new Vue({
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
            },
            genomics: {
                regGeneticInfo: false,
                viewGeneticInfo: false
            }
        }
    },

    mounted() {
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

            case '/breeder/pedigree':
                this.currentRoute.breeder.viewSwinePedigree = true;
                break;

            case '/breeder/swinecart':
                this.currentRoute.breeder.swineCart = true;
                break;

            default: break;

        }
    }
});
