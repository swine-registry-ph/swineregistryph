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
                            <input v-model="gpOne.geneticInfoId"
                                :id="gpOneIdPrefix + 'genetic-info-id'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'genetic-info-id'">Genetic Information ID (optional)</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.farmSwineId"
                                :id="gpOneIdPrefix + 'farm-swine-id'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'farm-swine-id'">Farm Swine ID / Earmark</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.teatNo"
                                :id="gpOneIdPrefix + 'teatno'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'teatno'">Teat number</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.birthWeight"
                                :id="gpOneIdPrefix + 'birth-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'birth-weight'">Birth weight</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.weight"
                                :id="gpOneIdPrefix + 'weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'weight'">Weight when data was collected</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.bft"
                                :id="gpOneIdPrefix + 'bft'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'bft'">Backfat Thickness (mm)</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.fe"
                                :id="gpOneIdPrefix + 'feed-efficiency'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.littersizeAliveMale"
                                :id="gpOneIdPrefix + 'total-m'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'total-m'">Total (M) born alive</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.littersizeAliveFemale"
                                :id="gpOneIdPrefix + 'total-f'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'total-f'">Total (F) born alive</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.littersizeWeaning"
                                :id="gpOneIdPrefix + 'littersize-weaning'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.litterweightWeaning"
                                :id="gpOneIdPrefix + 'litterweight-weaning'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOne.dateWeaning"
                                @date-select="val => {gpOne.dateWeaning = val}"
                            >
                            </app-input-date>
                            <label for=""> Date at weaning </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.parity"
                                :id="gpOneIdPrefix + 'parity'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'parity'">Parity</label>
                        </div>

                        <div class="col s12">
                            <br>
                        </div>

                        <!-- ADG computation from Birth-->
                        <div class="col s12">
                            <h6>
                                <b>Average Daily Gain computation from Birth</b>
                            </h6>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOne.adgBirthEndDate"
                                @date-select="val => {gpOne.adgBirthEndDate = val}"
                            >
                            </app-input-date>
                            <label for=""> End Date </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.adgBirthEndWeight"
                                :id="gpOneIdPrefix + 'adg-birth-end-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg-birth-end-weight'">End Weight</label>
                        </div>

                        <div class="col s12">
                            <br>
                        </div>

                        <!-- ADG computation on Test-->
                        <div class="col s12">
                            <h6>
                                <b>Average Daily Gain computation on Test</b>
                            </h6>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOne.adgTestStartDate"
                                @date-select="val => {gpOne.adgTestStartDate = val}"
                            >
                            </app-input-date>
                            <label for=""> Start Date </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.adgTestStartWeight"
                                :id="gpOneIdPrefix + 'adg-test-start-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg-test-start-weight'">Start Weight</label>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOne.adgTestEndDate"
                                @date-select="val => {gpOne.adgTestEndDate = val}"
                            >
                            </app-input-date>
                            <label for=""> End Date </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.adgTestEndWeight"
                                :id="gpOneIdPrefix + 'adg-test-end-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg-test-end-weight'">End Weight</label>
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
                                <input v-model="gpOne.houseType"
                                    name="house-type"
                                    type="radio"
                                    id="house-type-tunnel"
                                    value="tunnel"
                                >
                                <label for="house-type-tunnel">Tunnel ventilated</label>
                            </p>
                            <p>
                                <input v-model="gpOne.houseType"
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
                gpOne: {
                    geneticInfoId: '',
                    farmSwineId: '',
                    houseType: '',
                    teatNo: '',
                    weight: '',
                    adgBirthEndDate: '',
                    adgBirthEndWeight: '',
                    adgTestStartDate: '',
                    adgTestEndDate: '',
                    adgTestStartWeight: '',
                    adgTestEndWeight: '',
                    bft: '',
                    fe: '',
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

        methods: {
            objectIsEmpty(obj) {
                return _.isEmpty(obj);
            },

            triggerGoToTabEvent(tabId) {
                this.$emit('goToTabEvent', tabId);
            }
        },

        mounted() {
            console.log('Component mounted.');
        }
    }
</script>

<style scoped lang="css">

</style>
