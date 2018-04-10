<template lang="html">
    <!-- GP -->
    <div id="" class="col s12 m12 l6 offset-l3 parent-container">
        <!-- GP: radio if existing or new -->
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

        <!-- GP: existing -->
        <template v-if="status === 'existing'">
            <div class="col s8 offset-s2 input-field">
                <input v-model="existingParentRegNo"
                    :id="parentIdPrefix + 'reg-no'"
                    type="text"
                    class="validate"
                >
                <label :for="parentIdPrefix + 'reg-no'">GP {{ parentGender }} Registration #</label>
            </div>
        </template>

        <!-- GP: new -->
        <template v-else-if="status === 'new'">
            <!-- GP: imported or not -->
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
                <!-- GP: properties for imported -->
                <div class="col s12 input-field">
                    <input v-model="gpImported.regNo"
                        :id="parentIdPrefix + 'imported-reg-no'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'imported-reg-no'">Imported Animal Registration #</label>
                </div>
                <div class="col s12 input-field">
                    <input v-model="gpImported.farmFromName"
                        :id="parentIdPrefix + 'imported-reg-no'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'imported-reg-no'">Farm From Name</label>
                </div>
            </template>

            <template v-else-if="imported === 'no'">

                <!-- GP: properties for not imported -->
                <div class="col s12 input-field">
                    <input v-model="gp.geneticInfoId"
                        :id="parentIdPrefix + 'genetic-info-id'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'genetic-info-id'">Genetic Information ID (optional)</label>
                </div>
                <div class="input-field col s12">
                    <app-input-select
                        labelDescription="Farm From"
                        v-model="gp.farmFrom"
                        :options="farmoptions"
                        @select="val => {gp.farmFrom = val}"
                    >
                    </app-input-select>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.farmSwineId"
                        :id="parentIdPrefix + 'farm-swine-id'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'farm-swine-id'">Farm Swine ID / Earmark</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.teatNo"
                        :id="parentIdPrefix + 'teatno'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'teatno'">Teat number</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gp.birthDate"
                        @date-select="val => {gp.birthDate = val}"
                    >
                    </app-input-date>
                    <label for=""> Birth Date </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.birthWeight"
                        :id="parentIdPrefix + 'birth-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'birth-weight'">Birth Weight</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.littersizeAliveMale"
                        :id="parentIdPrefix + 'total-m'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'total-m'">Total (M) born alive</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.littersizeAliveFemale"
                        :id="parentIdPrefix + 'total-f'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'total-f'">Total (F) born alive</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.littersizeWeaning"
                        :id="parentIdPrefix + 'littersize-weaning'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.litterweightWeaning"
                        :id="parentIdPrefix + 'litterweight-weaning'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gp.dateWeaning"
                        @date-select="val => {gp.dateWeaning = val}"
                    >
                    </app-input-date>
                    <label for=""> Date at weaning </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.parity"
                        :id="parentIdPrefix + 'parity'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'parity'">Parity</label>
                </div>

                <div class="col s12">
                    <br>
                </div>

                <!-- GP: House Type -->
                <div class="col s12">
                    <h6>
                        <b>House Type</b>
                    </h6>
                    <p>
                        <input v-model="gp.houseType"
                            :name="parentIdPrefix + 'house-type'"
                            type="radio"
                            :id="parentIdPrefix + 'house-type-tunnel'"
                            value="tunnel"
                        >
                        <label :for="parentIdPrefix + 'house-type-tunnel'">Tunnel ventilated</label>
                    </p>
                    <p>
                        <input v-model="gp.houseType"
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

                <!-- GP: ADG computation from Birth -->
                <div class="col s12">
                    <h6>
                        <b>Average Daily Gain computation from Birth</b>
                    </h6>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gp.adgBirthEndDate"
                        @date-select="val => {gp.adgBirthEndDate = val}"
                    >
                    </app-input-date>
                    <label for=""> End Date </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.adgBirthEndWeight"
                        :id="parentIdPrefix + 'adg-birth-end-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'adg-birth-end-weight'">End Weight</label>
                </div>

                <div class="col s12">
                    <br>
                </div>

                <!-- GP: Swine Testing Information -->
                <div class="col s12">
                    <h6>
                        <b>Swine Testing Information</b>
                    </h6>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gp.adgTestStartDate"
                        @date-select="val => {gp.adgTestStartDate = val}"
                    >
                    </app-input-date>
                    <label for=""> Start Test Date </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.adgTestStartWeight"
                        :id="parentIdPrefix + 'adg-test-start-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'adg-test-start-weight'">Start Test Weight</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gp.adgTestEndDate"
                        @date-select="val => {gp.adgTestEndDate = val}"
                    >
                    </app-input-date>
                    <label for=""> End Test Date </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.adgTestEndWeight"
                        :id="parentIdPrefix + 'adg-test-end-weight'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'adg-test-end-weight'">End Test Weight</label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.bft"
                        :id="parentIdPrefix + 'bft'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'bft'">Backfat Thickness [BFT] (mm)</label>
                </div>
                <div class="col s6 input-field">
                    <app-input-date
                        v-model="gp.bftCollected"
                        @date-select="val => {gp.bftCollected = val}"
                    >
                    </app-input-date>
                    <label for=""> Date when BFT was collected </label>
                </div>
                <div class="col s6 input-field">
                    <input v-model="gp.feedIntake"
                        :id="parentIdPrefix + 'feed-intake'"
                        type="text"
                        class="validate"
                    >
                    <label :for="parentIdPrefix + 'feed-intake'">Total Feed Intake on Test</label>
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
                existingParentRegNo: '',
                gpImported: {
                    regNo: '',
                    farmFromName: ''
                },
                gp: {
                    farmSwineId: '',
                    geneticInfoId: '',
                    farmFrom: '',
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
                }
            }
        },

        watch: {
            'status': function() {
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            'imported': function() {
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            }
        }
    }
</script>

<style scoped lang="css">

</style>
