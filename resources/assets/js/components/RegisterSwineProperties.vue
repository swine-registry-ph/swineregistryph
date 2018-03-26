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
                        <div class="col s6 input-field">
                            <input v-model="gpOne.birth_weight"
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
                            <input v-model="gpOne.teatNo"
                                :id="gpOneIdPrefix + 'teatno'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'teatno'">Teat number</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.parity"
                                :id="gpOneIdPrefix + 'parity'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'parity'">Parity</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.littersizeAlive_male"
                                :id="gpOneIdPrefix + 'total-m'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'total-m'">Total (M) born alive</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.littersizeAlive_female"
                                :id="gpOneIdPrefix + 'total-f'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'total-f'">Total (F) born alive</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.littersize_weaning"
                                :id="gpOneIdPrefix + 'littersize-weaning'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.litterweight_weaning"
                                :id="gpOneIdPrefix + 'litterweight-weaning'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOne.date_weaning"
                                @date-select="val => {gpOne.date_weaning = val}"
                            >
                            </app-input-date>
                            <label for=""> Date at weaning </label>
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
                                v-model="gpOne.adgBirth_endDate"
                                @date-select="val => {gpOne.adgBirth_endDate = val}"
                            >
                            </app-input-date>
                            <label for=""> End Date </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.adgBirth_endWeight"
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
                                v-model="gpOne.adgTest_startDate"
                                @date-select="val => {gpOne.adgTest_startDate = val}"
                            >
                            </app-input-date>
                            <label for=""> Start Date </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.adgTest_startWeight"
                                :id="gpOneIdPrefix + 'adg-test-start-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg-test-start-weight'">Start Weight</label>
                        </div>
                        <div class="col s6 input-field">
                            <app-input-date
                                v-model="gpOne.adgTest_endDate"
                                @date-select="val => {gpOne.adgTest_endDate = val}"
                            >
                            </app-input-date>
                            <label for=""> End Date </label>
                        </div>
                        <div class="col s6 input-field">
                            <input v-model="gpOne.adgTest_endWeight"
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

                        <div class="col s12 center-align">
                            <button @click.prevent="triggerSubmitSwineInfoEvent"
                                class="btn waves-effect waves-light"
                                type="submit"
                                name="action"
                            >
                                Submit Info <i class="material-icons right">send</i>
                            </button>
                        </div>
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
                    houseType: '',
                    teatNo: '',
                    weight: '',
                    adgBirth_endDate: '',
                    adgBirth_endWeight: '',
                    adgTest_startDate: '',
                    adgTest_endDate: '',
                    adgTest_startWeight: '',
                    adgTest_endWeight: '',
                    bft: '',
                    fe: '',
                    birth_weight: '',
                    littersizeAlive_male: '',
                    littersizeAlive_female: '',
                    parity: '',
                    littersize_weaning: '',
                    litterweight_weaning: '',
                    date_weaning: ''
                }
            }
        },

        methods: {
            objectIsEmpty(obj) {
                return _.isEmpty(obj);
            },

            triggerSubmitSwineInfoEvent() {
                this.$emit('submitSwineInfoEvent', {
                    data: this.gpOne
                });
            }
        },

        mounted() {
            console.log('Component mounted.');
        }
    }
</script>

<style scoped lang="css">

</style>
