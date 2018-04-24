<template lang="html">
    <!-- GP Parent -->
    <div id="" class="col s12 m12 l6 offset-l3 parent-container">
        <!-- GP Parent: radio if existing or new -->
        <div class="col s12">
            <h6>
                <b>Choose an option</b>
            </h6>
            <p>
                <input v-model="status"
                    :name="parentIdPrefix + 'status'"
                    type="radio"
                    :id="parentIdPrefix + 'new'"
                    value="new"
                >
                <label :for="parentIdPrefix + 'new'">{{ parentGender }} is not yet registered in the system</label>
            </p>
            <p>
                <input v-model="status"
                    :name="parentIdPrefix + 'status'"
                    type="radio"
                    :id="parentIdPrefix + 'existing'"
                    value="existing"
                >
                <label :for="parentIdPrefix + 'existing'">{{ parentGender }} is currently registered in the system</label>
            </p>
        </div>

        <div class="col s12">
            <br>
        </div>

        <!-- GP Parent: existing -->
        <template v-if="status === 'existing'">
            <div class="col s8 offset-s2 input-field">
                <input @focusout.stop.prevent="simpleCatch"
                    v-model="gpParentExistingRegNo"
                    :id="parentIdPrefix + 'reg-no'"
                    class="validate"
                    :class="existingInputClass"
                    type="text"
                >
                <label :for="parentIdPrefix + 'reg-no'"
                    :data-error="existingInputDataError"
                    :data-success="existingInputDataSuccess"
                >
                    GP {{ parentGender }} Registration #
                </label>
            </div>

            <div class="col s8 offset-s2 center-align">
                <br>
                <a href="#!"
                    :id="parentIdPrefix + 'check'"
                    class="btn waves-effect waves-light "
                    type="submit"
                    name="action"
                    @click.prevent="checkParent($event)"
                >
                    Check {{ parentGender }} if existing
                </a>
            </div>
        </template>

        <!-- GP Parent: new -->
        <template v-else-if="status === 'new'">
            <!-- GP Parent: imported or not -->
            <div class="col s12">
                <h6>
                    <b>Is GP {{ parentGender }} imported?</b>
                </h6>
                <p>
                    <input v-model="imported"
                        :name="parentIdPrefix + 'imported'"
                        type="radio"
                        :id="parentIdPrefix + 'imported-yes'"
                        value="yes"
                    >
                    <label :for="parentIdPrefix + 'imported-yes'">Yes</label>
                </p>
                <p>
                    <input v-model="imported"
                        :name="parentIdPrefix + 'imported'"
                        type="radio"
                        :id="parentIdPrefix + 'imported-no'"
                        value="no"
                    >
                    <label :for="parentIdPrefix + 'imported-no'">No</label>
                </p>
            </div>

            <div class="col s12">
                <br>
            </div>

            <template v-if="imported === 'yes'">
                <!-- GP Parent: properties for imported -->
                <div class="col s12 input-field">
                    <input v-model="gpParentImportedRegNo"
                        :id="parentIdPrefix + 'imported-reg-no'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'imported-reg-no'">Imported Animal Registration #</label>
                </div>
                <div class="col s12 input-field">
                    <input v-model="gpParentImportedFarmOfOrigin"
                        :id="parentIdPrefix + 'imported-farm-origin'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'imported-farm-origin'">Farm Of Origin</label>
                </div>
                <div class="col s12 input-field">
                    <input v-model="gpParentImportedCountryOfOrigin"
                        :id="parentIdPrefix + 'imported-country-origin'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'imported-country-origin'">Country of Origin</label>
                </div>
            </template>

            <template v-else-if="imported === 'no'">

                <!-- GP Parent: properties for not imported -->
                <div class="col s12 input-field">
                    <input v-model="gpParentGeneticInfoId"
                        :id="parentIdPrefix + 'genetic-info-id'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'genetic-info-id'">Genetic Information ID (optional)</label>
                </div>
                <div class="input-field col s12">
                    <app-input-select
                        labelDescription="Farm Of Origin"
                        v-model="gpParentFarmFromId"
                        :options="farmoptions"
                        @select="val => {gpParentFarmFromId = val}"
                    >
                    </app-input-select>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentFarmSwineId"
                        :id="parentIdPrefix + 'farm-swine-id'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'farm-swine-id'">Farm Swine ID / Earmark</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentTeatNo"
                        :id="parentIdPrefix + 'teatno'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'teatno'">Number of Teats</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gpParentBirthDate"
                        @date-select="val => {gpParentBirthDate = val}"
                    >
                    </app-input-date>
                    <label for=""> Birth Date </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentBirthWeight"
                        :id="parentIdPrefix + 'birth-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'birth-weight'">Birth Weight (kg)</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentLittersizeAliveMale"
                        :id="parentIdPrefix + 'total-m'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'total-m'">Total (M) born alive</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentLittersizeAliveFemale"
                        :id="parentIdPrefix + 'total-f'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'total-f'">Total (F) born alive</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentLittersizeWeaning"
                        :id="parentIdPrefix + 'littersize-weaning'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentLitterweightWeaning"
                        :id="parentIdPrefix + 'litterweight-weaning'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gpParentDateWeaning"
                        @date-select="val => {gpParentDateWeaning = val}"
                    >
                    </app-input-date>
                    <label for=""> Date at weaning </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentParity"
                        :id="parentIdPrefix + 'parity'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'parity'">Parity</label>
                </div>

                <div class="col s12">
                    <br>
                </div>

                <!-- GP Parent: House Type -->
                <div class="col s12">
                    <h6>
                        <b>House Type</b>
                    </h6>
                    <p>
                        <input v-model="gpParentHouseType"
                            :name="parentIdPrefix + 'house-type'"
                            type="radio"
                            :id="parentIdPrefix + 'house-type-tunnel'"
                            value="tunnel"
                        >
                        <label :for="parentIdPrefix + 'house-type-tunnel'">Tunnel ventilated</label>
                    </p>
                    <p>
                        <input v-model="gpParentHouseType"
                            :name="parentIdPrefix + 'house-type'"
                            type="radio"
                            :id="parentIdPrefix + 'house-type-open'"
                            value="open"
                        >
                        <label :for="parentIdPrefix + 'house-type-open'">Open sided</label>
                    </p>
                </div>

                <div class="col s12">
                    <br>
                </div>

                <!-- GP Parent: ADG computation from Birth -->
                <div class="col s12">
                    <h6>
                        <b>Average Daily Gain (ADG) computation from Birth</b>
                    </h6>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gpParentAdgBirthEndDate"
                        @date-select="val => {gpParentAdgBirthEndDate = val}"
                    >
                    </app-input-date>
                    <label for=""> End Date </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentAdgBirthEndWeight"
                        :id="parentIdPrefix + 'adg-birth-end-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'adg-birth-end-weight'">End Weight (kg)</label>
                </div>

                <div class="col s12">
                    <br>
                </div>

                <!-- GP Parent: Swine Testing Information -->
                <div class="col s12">
                    <h6>
                        <b>Swine Testing Information</b>
                    </h6>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gpParentAdgTestStartDate"
                        @date-select="val => {gpParentAdgTestStartDate = val}"
                    >
                    </app-input-date>
                    <label for=""> Start Date of Testing </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentAdgTestStartWeight"
                        :id="parentIdPrefix + 'adg-test-start-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'adg-test-start-weight'">Weight at Start of Testing (kg)</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gpParentAdgTestEndDate"
                        @date-select="val => {gpParentAdgTestEndDate = val}"
                    >
                    </app-input-date>
                    <label for=""> End Date of Testing </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentAdgTestEndWeight"
                        :id="parentIdPrefix + 'adg-test-end-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'adg-test-end-weight'">Weight at End of Testing (kg)</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentBft"
                        :id="parentIdPrefix + 'bft'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'bft'">Backfat Thickness [BFT] (mm)</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gpParentBftCollected"
                        @date-select="val => {gpParentBftCollected = val}"
                    >
                    </app-input-date>
                    <label for=""> Date when BFT was collected </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gpParentFeedIntake"
                        :id="parentIdPrefix + 'feed-intake'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'feed-intake'">Total Feed Intake during Test (kg)</label>
                </div>
            </template>

            <div class="col s12">
                <br>
            </div>

        </template>
    </div>
</template>

<script>
    export default {
        props: {
            farmoptions: Array,
            parentGender: String,
            parentIdPrefix: String
        },

        data() {
            return {
                status: 'existing',
                imported: 'no',
                existingButtonPressed: false,
                existingInputIsValid: true,
                existingInputDataError: '',
                existingInputDataSuccess: ''
            }
        },

        computed: {
            existingInputClass() {
                // determine returning 'valid' or 'invalid' class
                // depending on the response from the server
                if(this.gpParentExistingRegNo && this.existingButtonPressed){
                    return (this.existingInputIsValid) ? 'valid' : 'invalid';
                }
                else return '';
            },
            parentSex() {
                // get sex (male/female) of parent from its gender (sire/dam)
                return (this.parentGender === 'Sire') ? 'male' : 'female';
            },
            prefixedGender() {
                // add gp prefix to parentGender
                return `gp${this.parentGender}`;
            },
            gpParentExistingRegNo: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].existingRegNo; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'existingRegNo',
                        value: value
                    });
                }
            },
            gpParentImportedRegNo: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].imported.regNo; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'imported.regNo',
                        value: value
                    });
                }
            },
            gpParentImportedFarmOfOrigin: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].imported.farmOfOrigin; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'imported.farmOfOrigin',
                        value: value
                    });
                }
            },
            gpParentImportedCountryOfOrigin: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].imported.countryOfOrigin; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'imported.countryOfOrigin',
                        value: value
                    });
                }
            },
            gpParentGeneticInfoId: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].geneticInfoId; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'geneticInfoId',
                        value: value
                    });
                }
            },
            gpParentFarmSwineId: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].farmSwineId; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'farmSwineId',
                        value: value
                    });
                }
            },
            gpParentFarmFromId: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].farmFromId; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'farmFromId',
                        value: value
                    });
                }
            },
            gpParentBirthDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].birthDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'birthDate',
                        value: value
                    });
                }
            },
            gpParentHouseType: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].houseType; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'houseType',
                        value: value
                    });
                }
            },
            gpParentTeatNo: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].teatNo; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'teatNo',
                        value: value
                    });
                }
            },
            gpParentAdgBirthEndDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].adgBirthEndDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'adgBirthEndDate',
                        value: value
                    });
                }
            },
            gpParentAdgBirthEndWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].adgBirthEndWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'adgBirthEndWeight',
                        value: value
                    });
                }
            },
            gpParentAdgTestStartDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].adgTestStartDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'adgTestStartDate',
                        value: value
                    });
                }
            },
            gpParentAdgTestEndDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].adgTestEndDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'adgTestEndDate',
                        value: value
                    });
                }
            },
            gpParentAdgTestStartWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].adgTestStartWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'adgTestStartWeight',
                        value: value
                    });
                }
            },
            gpParentAdgTestEndWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].adgTestEndWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'adgTestEndWeight',
                        value: value
                    });
                }
            },
            gpParentBft: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].bft; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'bft',
                        value: value
                    });
                }
            },
            gpParentBftCollected: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].bftCollected; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'bftCollected',
                        value: value
                    });
                }
            },
            gpParentFeedIntake: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].feedIntake; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'feedIntake',
                        value: value
                    });
                }
            },
            gpParentBirthWeight: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].birthWeight; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'birthWeight',
                        value: value
                    });
                }
            },
            gpParentLittersizeAliveMale: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].littersizeAliveMale; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'littersizeAliveMale',
                        value: value
                    });
                }
            },
            gpParentLittersizeAliveFemale: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].littersizeAliveFemale; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'littersizeAliveFemale',
                        value: value
                    });
                }
            },
            gpParentParity: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].parity; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'parity',
                        value: value
                    });
                }
            },
                // get and set value from vuex store
            gpParentLittersizeWeaning: {
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].littersizeWeaning; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'littersizeWeaning',
                        value: value
                    });
                }
            },
            gpParentLitterweightWeaning: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].litterweightWeaning; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'litterweightWeaning',
                        value: value
                    });
                }
            },
            gpParentDateWeaning: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine[`${this.prefixedGender}`].dateWeaning; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: this.prefixedGender,
                        property: 'dateWeaning',
                        value: value
                    });
                }
            }
        },

        methods: {
            simpleCatch(){
                // simple catch from stop and prevent event default from
                // gpParentExistingRegNo input text
                setTimeout(() => {
                    this.existingButtonPressed = false;
                }, 0);
            },
            checkParent(event) {
                const vm = this;
                const checkButton = $(`#${vm.parentIdPrefix}check`);

                if(!this.gpParentExistingRegNo){
                    this.existingButtonPressed = false;
                    return;
                }

                this.disableButtons(checkButton, event.target, `Checking ${vm.parentGender}...`);
                this.existingButtonPressed = true;

                // Fetch from server parent details
                axios.get(`/breeder/manage-swine/get/${vm.parentSex}/${vm.gpParentExistingRegNo}`)
                    .then((response) => {
                        // Check if object or string is returned
                        // If object is returned then it is
                        // a success else if it is a
                        // string, it's a fail
                        if(typeof response.data === 'object'){
                            // Put response to vuex store
                            this.$store.commit('updateParent', {
                                instance: this.prefixedGender,
                                data: response.data
                            });

                            setTimeout(() => {
                                this.existingInputIsValid = true;
                                this.existingInputDataSuccess = `${vm.parentGender} exists.`;
                                this.existingInputDataError = '';
                                Materialize.toast(`${vm.parentGender} exists.`, 2500, 'green lighten-1');
                            }, 0);
                        }
                        else if(typeof response.data === 'string'){
                            setTimeout(() => {
                                this.existingInputIsValid = false;
                                this.existingInputDataError = response.data;
                                this.existingInputDataSuccess = '';
                                Materialize.toast(response.data, 3000, 'amber darken-2');
                            }, 0);
                        }

                        this.enableButtons(checkButton, event.target, `Check ${vm.parentGender} if existing`);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },

            updateParentPropertiesToDefault() {
                // Update vuex store
                this.$store.commit('updateParent', {
                    instance: this.prefixedGender,
                    sex: this.parentSex,
                    data: null,
                });
            },

            disableButtons(buttons, actionBtnElement, textToShow) {
                buttons.addClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            },

            enableButtons(buttons, actionBtnElement, textToShow) {
                buttons.removeClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            }
        },

        watch: {
            'status': function() {
                // update parent's properties to default
                this.updateParentPropertiesToDefault();

                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            'imported': function() {
                // update parent's properties to default
                this.updateParentPropertiesToDefault();

                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            }
        }
    }
</script>

<style scoped lang="css">

</style>
