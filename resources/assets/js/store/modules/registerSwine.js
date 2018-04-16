// Initial state
const state = {
    gpOne: {
        id: 0,
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
        dateWeaning: ''
    },
    gpSire: {
        existingRegNo: '',
        imported: {
            regNo: '',
            farmOfOrigin: '',
            countryOfOrigin: ''
        },
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
    imageFiles: []
};

// getters
const getters = {
    gpOneData: state => {
        return state.gpOne;
    },

    gpSireData: state => {
        return state.gpSire;
    },

    gpDamData: state => {
        return state.gpDam;
    },

    imageFiles: state => {
        return state.imageFiles;
    },

    computedAdgFromBirth: (state, getters) => (instance) => {
        // ADG from birth is computed as (endWeight - birthWeight) / (endDay - birthDay)
        const endDateInDays = getters.msToDays(new Date(state[instance].adgBirthEndDate).valueOf());
        const birthDateInDays = getters.msToDays(new Date(state[instance].birthDate).valueOf());
        const dividend = parseInt(state[instance].adgBirthEndWeight) - parseInt(state[instance].birthWeight);
        const divisor =  endDateInDays - birthDateInDays;

        return (divisor > 0) ? getters.precisionRound(dividend/divisor, 2) : 0;
    },

    computedAdgOnTest: (state, getters) => (instance) => {
        // ADG on test is computed as (endWeight - startWeight) / (endDay - startDay)
        const endDateInDays = getters.msToDays(new Date(state[instance].adgTestEndDate).valueOf());
        const startDateInDays = getters.msToDays(new Date(state[instance].adgTestStartDate).valueOf());
        const dividend = parseInt(state[instance].adgTestEndWeight) - parseInt(state[instance].adgTestStartWeight);
        const divisor =  endDateInDays - startDateInDays;

        return (divisor > 0) ? getters.precisionRound(dividend/divisor, 2) : 0;
    },

    computedFeedEfficiency: (state, getters) => (instance) => {
        // Feed efficiency is computed as feedIntake / adgOnTest
        const feedIntake = state[instance].feedIntake;
        const adgOnTest = getters.computedAdgOnTest(instance);

        return (adgOnTest > 0) ? getters.precisionRound(feedIntake/adgOnTest, 2) : 0;
    },

    msToDays: (state) => (milliseconds) => {
        // Convert milliseconds to days
        return (milliseconds/1000)/86400;
    },

    precisionRound: (state) => (number, precision = 2) => {
        // Rounds number to 'precision' number of places
        // Default number of places is 2
        const factor = Math.pow(10, precision);

        return !isNaN(Math.round(number * factor) / factor) ? Math.round(number * factor) / factor : 0;
    }

}

// mutations
const mutations = {
    updateValue(state, payload) {
        // Check if property includes period for access
        // to nested object property such as
        // gpSire.imported.regNo
        if(payload.property.includes('.')){
            const nestedProperty = payload.property.split('.');
            state[payload.instance][nestedProperty[0]][nestedProperty[1]] = payload.value;
        }
        else state[payload.instance][payload.property] = payload.value;
    }
}

// actions
const actions = {

}

export default {
    state,
    getters,
    actions,
    mutations
};
