
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

// Breeder
Vue.component('custom-input-select', require('./components/CustomInputSelect.vue'));
Vue.component('custom-input-date', require('./components/CustomInputDate.vue'));
Vue.component('upload-photo', require('./components/UploadPhoto.vue'));
Vue.component('swine-properties', require('./components/SwineProperties.vue'));
Vue.component('add-swine-summary', require('./components/AddSwineSummary.vue'));
Vue.component('collection', require('./components/Collection.vue'));
Vue.component('registered-swine', require('./components/RegisteredSwine.vue'));

// Admin
Vue.component('manage-breeds', require('./components/ManageBreeds.vue'));
Vue.component('manage-properties', require('./components/ManageProperties.vue'));

// For main container
const app = new Vue({
    el: '#app'
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
                reports: false
            },
            breeder: {
                showRegForm: false,
                viewRegdSwine: false,
                viewSwinePedigree: false,
                manageFarms: false,
                reports: false
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

            default: break;

        }
    }
});
