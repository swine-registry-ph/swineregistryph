
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
Vue.component('app-change-password', require('./components/AppChangePassword.vue'));
Vue.component('app-input-date', require('./components/AppInputDate.vue'));
Vue.component('app-input-select', require('./components/AppInputSelect.vue'));

// Admin
Vue.component('certificate-requests-admin', require('./components/CertificateRequestsAdmin.vue'));
Vue.component('manage-breeds', require('./components/ManageBreeds.vue'));
Vue.component('manage-breeders', require('./components/ManageBreeders.vue'));
Vue.component('manage-evaluators', require('./components/ManageEvaluators.vue'));
Vue.component('manage-genomics', require('./components/ManageGenomics.vue'));
Vue.component('manage-properties', require('./components/ManageProperties.vue'));
Vue.component('manage-apis', require('./components/ManageAPIs.vue'));

// Breeder
Vue.component('certificate-requests-breeder', require('./components/CertificateRequestsBreeder.vue'));
Vue.component('inspection-requests-breeder', require('./components/InspectionRequestsBreeder.vue'));
Vue.component('register-swine', require('./components/RegisterSwine.vue'));
Vue.component('view-registered-swine', require('./components/ViewRegisteredSwine.vue'));

// Evaluator
Vue.component('inspection-requests-evaluator', require('./components/InspectionRequestsEvaluator.vue')); 

// Genomics
Vue.component('register-laboratory-results', require('./components/RegisterLaboratoryResults.vue'));
Vue.component('view-laboratory-results', require('./components/ViewLaboratoryResults.vue'));

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
                showManageBreeders: false,
                showManageEvaluators: false,
                showManageGenomics: false,
                showManagePropertiesView: false,
                showManageBreedsView: false,
                manageAPIsView: false,
                showCertificates: false,
                reports: false,
                changePassword: false
            },
            breeder: {
                showRegForm: false,
                viewRegdSwine: false,
                viewSwinePedigree: false,
                showInspection: false, 
                showCertificates: false, 
                manageFarms: false,
                reports: false,
                changePassword: false
            },
            evaluator: {
                manageInspections: false,
                changePassword: false
            },
            genomics: {
                regLabResults: false,
                viewLabResults: false,
                changePassword: false
            }
        }
    },

    mounted() {
        // const mainElement = document.querySelector('.main-logged-in');
        // const footerElement = document.querySelector('.footer-logged-in');

        // Initialize side navigation
        $(".button-collapse").sideNav({
            onOpen: function() {
                // Add 300px padding on left of containers upon 
                // opening of side navigation
                // if(!window.matchMedia("(max-width: 992px)").matches){
                //     mainElement.style.cssText = "padding-left: 300px;";
                //     footerElement.style.cssText = "padding-left: 300px;";
                // }
            },

            onClose: function() {
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

            case '/admin/manage/genomics':
                this.currentRoute.admin.showManageGenomics = true;
                break;
            
            case '/admin/certificates':
                this.currentRoute.admin.showCertificates = true;
                break;
            
            case '/admin/change-password':
                this.currentRoute.admin.changePassword = true;
                break;

            case '/breeder/manage-swine/register':
                this.currentRoute.breeder.showRegForm = true;
                break;

            case '/breeder/manage-swine/view':
                this.currentRoute.breeder.viewRegdSwine = true;
                break;

            case '/breeder/inspections':
                this.currentRoute.breeder.showInspection = true;
                break;

            case '/breeder/certificates':
                this.currentRoute.breeder.showCertificates = true;
                break;

            case '/breeder/pedigree':
                this.currentRoute.breeder.viewSwinePedigree = true;
                break;

            case '/breeder/change-password':
                this.currentRoute.breeder.changePassword = true;
                break;

            case '/evaluator/manage/inspections':
                this.currentRoute.evaluator.manageInspections = true;
                break;

            case '/evaluator/change-password':
                this.currentRoute.evaluator.changePassword = true;
                break;

            case '/genomics/register':
                this.currentRoute.genomics.regLabResults = true;
                break;
            
            case '/genomics/manage/laboratory-results':
                this.currentRoute.genomics.viewLabResults = true;
                break;

            case '/genomics/change-password':
                this.currentRoute.genomics.changePassword = true;
                break;

            default: break;

        }
    }
});
