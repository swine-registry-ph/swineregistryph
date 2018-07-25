import Vue from 'vue';
import Vuex from 'vuex';
import registerSwine from './modules/registerSwine'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        registerSwine
    }
});
