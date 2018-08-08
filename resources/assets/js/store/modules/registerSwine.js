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
        // ADG from birth is computed as (endWeight - birthWeight) / 180
        // adjusted 180-day weight
        const endDateInDays = getters.msToDays(state[instance].adgBirthEndDate);
        const birthDateInDays = getters.msToDays(state[instance].birthDate);
        const days = endDateInDays - birthDateInDays;
        const adjWeightAt180 = getters.adjustedWeight(state[instance].adgBirthEndWeight, days, 180);
        const dividend = adjWeightAt180 - parseInt(state[instance].birthWeight);

        return (dividend > 0) ? getters.customRound(dividend/180, 2) : 0;
    },

    computedAdgOnTest: (state, getters) => (instance) => {
        // ADG on test is computed as (endWeight - startWeight) / 60
        // adjusted 150-day weight to 90-day weight
        const endDateInDays = getters.msToDays(state[instance].adgTestEndDate);
        const startDateInDays = getters.msToDays(state[instance].adgTestStartDate);
        const birthDateInDays = getters.msToDays(state[instance].birthDate);
        const endToBirthDays = endDateInDays - birthDateInDays;
        const startToBirthDays = startDateInDays - birthDateInDays;
        const adjWeightAt150 = getters.adjustedWeight(state[instance].adgTestEndWeight, endToBirthDays, 150);
        const adjWeightAt90 = getters.adjustedWeight(state[instance].adgTestStartWeight, startToBirthDays, 90);
        const dividend = adjWeightAt150 - adjWeightAt90;

        return (dividend > 0) ? getters.customRound(dividend/60, 2) : 0;
    },

    computedFeedEfficiency: (state, getters) => (instance) => {
        // Feed efficiency is computed as feedIntake / adgOnTest
        const feedIntake = state[instance].feedIntake;
        const adgOnTest = getters.computedAdgOnTest(instance);

        return (adgOnTest > 0) ? getters.customRound(feedIntake/adgOnTest, 2) : 0;
    },

    adjustedWeight: (state, getters) => (weight, days, toDays) => {
        // Compute adjusted weight according to 'toDays' variable
        // Ex. the adjusted 180-day weight should have the
        // equation (weight * 180) / days
        return (days === toDays)
            ? parseInt(weight)
            : (parseInt(weight) * toDays) / days;
    },

    msToDays: (state) => (date) => {
        // Convert date to milliseconds then
        // convert milliseconds to days
        return (new Date(date).valueOf()/1000)/86400;
    },

    customRound: (state) => (number, precision = 2) => {
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
    },

    updateParent(state, {instance, sex, data}) {
        if(data) {
            // Replace entire object given that the new
            // object has the same properties
            // as the old one
            state[instance] = data;
        }
        else {
            // Or make values of object set to default
            const defaultObject = Object.keys(state[instance]).map((key) => {
                if(key === 'sex') {
                    state[instance][key] = sex;
                }
                else if(key === 'imported') {
                    Object.keys(state[instance]['imported']).map((importedKey) => {
                        state[instance]['imported'][importedKey] = '';
                    });
                }
                else {
                    state[instance][key] = '';
                }
            });


        }
    },

    addToImageFiles(state, {imageDetails, orientation}) {
        state.imageFiles[orientation] = imageDetails;
    }
}

// actions
const actions = {

}

export default {
    state,
    getters,
    mutations,
    actions
};
