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
            farmFromName: ''
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
            farmFromName: ''
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
