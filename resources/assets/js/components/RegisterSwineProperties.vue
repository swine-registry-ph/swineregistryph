<template lang="html">
    <div id="gp-1" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">GP 1</span>

                <!-- For GP 1 -->
                <div class="row">
                    <div class="col s12 m10 l6 offset-m1 offset-l3">
                        <div class="col s12">
                            <br>
                        </div>

                        <!-- More info for GP 1 -->
                        <div class="col s12 input-field">
                            <input v-model="gpOneLabResultNo"
                                :id="gpOneIdPrefix + 'lab-result-no'"
                                type="text"
                                class="validate"
                                :class="labResultInputClass"
                                @focusout.stop.prevent="checkLaboratoryResult()"
                            >
                            <label :for="gpOneIdPrefix + 'lab-result-no'"
                                :data-error="labResultInputDataError"
                                :data-success="labResultInputDataSuccess"
                            >
                                Laboratory Result No. (optional)
                            </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneFarmSwineId"
                                :id="gpOneIdPrefix + 'farm-swine-id'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'farm-swine-id'">Farm Swine ID / Earmark</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneTeatNo"
                                :id="gpOneIdPrefix + 'teatno'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'teatno'">Number of Teats</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneBirthWeight"
                                :id="gpOneIdPrefix + 'birth-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'birth-weight'">Birth weight (kg)</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneParity"
                                :id="gpOneIdPrefix + 'parity'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'parity'">Parity</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneLittersizeAliveMale"
                                :id="gpOneIdPrefix + 'total-m'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'total-m'">Total (M) born alive</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneLittersizeAliveFemale"
                                :id="gpOneIdPrefix + 'total-f'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'total-f'">Total (F) born alive</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneLittersizeWeaning"
                                :id="gpOneIdPrefix + 'littersize-weaning'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneLitterweightWeaning"
                                :id="gpOneIdPrefix + 'litterweight-weaning'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOneDateWeaning"
                                @date-select="val => {gpOneDateWeaning = val}"
                            >
                            </app-input-date>
                            <label for=""> Date at weaning </label>
                        </div>

                        <div class="col s12">
                            <br>
                        </div>

                        <!-- House Type -->
                        <div class="col s12">
                            <h6>
                                <b>House Type</b>
                            </h6>
                            <p>
                                <input v-model="gpOneHouseType"
                                    name="house-type"
                                    type="radio"
                                    id="house-type-tunnel"
                                    value="tunnel"
                                >
                                <label for="house-type-tunnel">Tunnel ventilated</label>
                            </p>
                            <p>
                                <input v-model="gpOneHouseType"
                                    name="house-type"
                                    type="radio"
                                    id="house-type-open"
                                    value="open"
                                >
                                <label for="house-type-open">Open sided</label>
                            </p>
                        </div>

                        <div class="col s12">
                            <br>
                        </div>

                        <!-- ADG computation from Birth-->
                        <div class="col s12">
                            <h6>
                                <b>Average Daily Gain (ADG) computation from Birth</b>
                            </h6>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOneAdgBirthEndDate"
                                @date-select="val => {gpOneAdgBirthEndDate = val}"
                            >
                            </app-input-date>
                            <label for=""> End Date </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneAdgBirthEndWeight"
                                :id="gpOneIdPrefix + 'adg-birth-end-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg-birth-end-weight'">End Weight (kg)</label>
                        </div>

                        <div class="col s12">
                            <br>
                        </div>

                        <!-- Swine Testing Information -->
                        <div class="col s12">
                            <h6>
                                <b>Swine Testing Information</b>
                            </h6>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOneAdgTestStartDate"
                                @date-select="val => {gpOneAdgTestStartDate = val}"
                            >
                            </app-input-date>
                            <label for=""> Start Date of Testing </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneAdgTestStartWeight"
                                :id="gpOneIdPrefix + 'adg-test-start-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg-test-start-weight'">Weight at Start of Testing (kg)</label>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOneAdgTestEndDate"
                                @date-select="val => {gpOneAdgTestEndDate = val}"
                            >
                            </app-input-date>
                            <label for=""> End Date  of Testing </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneAdgTestEndWeight"
                                :id="gpOneIdPrefix + 'adg-test-end-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg-test-end-weight'">Weight at End of Testing (kg)</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneBft"
                                :id="gpOneIdPrefix + 'bft'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'bft'">Backfat Thickness [BFT] (mm)</label>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOneBftCollected"
                                @date-select="val => {gpOneBftCollected = val}"
                            >
                            </app-input-date>
                            <label for=""> Date when BFT was collected </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOneFeedIntake"
                                :id="gpOneIdPrefix + 'feed-intake'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'feed-intake'">Total Feed Intake during Test (kg)</label>
                        </div>

                        <div class="col s12">
                            <br>
                        </div>
                    </div>

                    <!-- Tab navigation links -->
                    <div class="col s12">
                        <a class="btn-floating btn-large waves-effect waves-light grey lighten-4 left"
                            @click.prevent="triggerGoToTabEvent('basic-information')"
                        >
                            <i class="material-icons black-text">arrow_back</i>
                        </a>
                        <a class="btn-floating btn-large waves-effect waves-light blue right"
                            @click.prevent="triggerGoToTabEvent('gp-parents')"
                        >
                            <i class="material-icons">arrow_forward</i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                gpOneIdPrefix: 'gp-one-',
                labResultInputClass: '',
                labResultInputDataError: '',
                labResultInputDataSuccess: ''
            }
        },

        computed: {
            gpOneFarmFromId () {
                return this.$store.state.registerSwine.gpOne.farmFromId;
            },
            gpOneLabResultNo: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.labResultNo; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'labResultNo',
                        value: value
                    });
                }
            },
            gpOneFarmSwineId: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.farmSwineId; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'farmSwineId',
                        value: value
                    });
                }
            },
            gpOneHouseType: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.houseType; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'houseType',
                        value: value
                    });
                }
            },
            gpOneTeatNo: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.teatNo; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'teatNo',
                        value: value
                    });
                }
            },
            gpOneAdgBirthEndDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.adgBirthEndDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'adgBirthEndDate',
                        value: value
                    });
                }
            },
            gpOneAdgBirthEndWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.adgBirthEndWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'adgBirthEndWeight',
                        value: value
                    });
                }
            },
            gpOneAdgTestStartDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.adgTestStartDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'adgTestStartDate',
                        value: value
                    });
                }
            },
            gpOneAdgTestEndDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.adgTestEndDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'adgTestEndDate',
                        value: value
                    });
                }
            },
            gpOneAdgTestStartWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.adgTestStartWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'adgTestStartWeight',
                        value: value
                    });
                }
            },
            gpOneAdgTestEndWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.adgTestEndWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'adgTestEndWeight',
                        value: value
                    });
                }
            },
            gpOneBft: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.bft; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'bft',
                        value: value
                    });
                }
            },
            gpOneBftCollected: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.bftCollected; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'bftCollected',
                        value: value
                    });
                }
            },
            gpOneFeedIntake: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.feedIntake; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'feedIntake',
                        value: value
                    });
                }
            },
            gpOneBirthWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.birthWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'birthWeight',
                        value: value
                    });
                }
            },
            gpOneLittersizeAliveMale: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.littersizeAliveMale; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'littersizeAliveMale',
                        value: value
                    });
                }
            },
            gpOneLittersizeAliveFemale: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.littersizeAliveFemale; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'littersizeAliveFemale',
                        value: value
                    });
                }
            },
            gpOneParity: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.parity; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'parity',
                        value: value
                    });
                }
            },
            gpOneLittersizeWeaning: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.littersizeWeaning; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'littersizeWeaning',
                        value: value
                    });
                }
            },
            gpOneLitterweightWeaning: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.litterweightWeaning; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'litterweightWeaning',
                        value: value
                    });
                }
            },
            gpOneDateWeaning: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.dateWeaning; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'dateWeaning',
                        value: value
                    });
                }
            }
        },

        methods: {
            triggerGoToTabEvent(tabId) {
                this.$emit('goToTabEvent', tabId);
            },

            checkLaboratoryResult() {
                const vm = this;

                if (!vm.gpOneLabResultNo) return;

                setTimeout(() => {
                    this.labResultInputClass = 'valid';
                    this.labResultInputDataError = '';
                    this.labResultInputDataSuccess = 'Checking...';
                }, 0);

                if (!vm.gpOneFarmFromId) {
                    setTimeout(() => {
                        this.labResultInputClass = 'invalid';
                        this.labResultInputDataError = 'Please provide Farm of Origin';
                        this.labResultInputDataSuccess = '';
                    }, 0);
                }
                else {
                    // Check laboratory result from server
                    axios.get(`/breeder/manage-swine/farm/${vm.gpOneFarmFromId}/check/${vm.gpOneLabResultNo}`)
                        .then((response) => {
                            this.$store.commit('updateValue', {
                                instance: 'gpOne',
                                property: 'labResultId',
                                value: response.data
                            });

                            setTimeout(() => {
                                this.labResultInputClass = 'valid';
                                this.labResultInputDataSuccess = `Laboratory Result ${vm.gpOneLabResultNo} exists`;
                                this.labResultInputDataError = '';
                            }, 0);
                        })
                        .catch((error) => {
                            setTimeout(() => {
                                this.labResultInputClass = 'invalid';
                                this.labResultInputDataError = error.response.data;
                                this.labResultInputDataSuccess = '';
                            }, 0);
                        });
                }
            }
        },

        mounted() {
            console.log('Component mounted.');
        }
    }
</script>

<style scoped lang="css">

</style>
