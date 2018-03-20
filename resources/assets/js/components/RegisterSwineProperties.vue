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
                            <input v-model="gpOne.adg"
                                :id="gpOneIdPrefix + 'adg'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'adg'">Average Daily Gain (g/day)</label>
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
                            <input v-model="gpOne.birth_weight"
                                :id="gpOneIdPrefix + 'birth-weight'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'birth-weight'">Birth weight</label>
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
                            <input v-model="gpOne.parity"
                                :id="gpOneIdPrefix + 'parity'"
                                type="text"
                                class="validate"
                            >
                            <label :for="gpOneIdPrefix + 'parity'">Parity</label>
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
                            <button @click.prevent="triggerSubmitSwineInfoEvent"
                                class="btn waves-effect waves-light right"
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
                    adg: '',
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
