<template lang="html">
    <div :id="category" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">{{ titleCategory }}</span>

                <!-- For GP Sire or GP Dam -->
                <div v-if="data">
                    <div v-if="objectIsEmpty(data)" class="">
                        <p> No data available. </p>
                    </div>
                    <div v-else class="">
                        <table class="striped">
                            <thead>
                                <tr>
                                    <th> Property </th>
                                    <th> Value </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="property in data.swine_properties">
                                    <td> {{ property.title }} </td>
                                    <td> {{ property.value }} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- For GP 1 -->
                <div v-else
                    class="row"
                >
                    <!-- Parents -->
                    <div class="col s6 input-field">
                        <input v-model="parents.sireRegNo"
                            :id="categoryWithDash + 'gpSire'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'gpSire'">GP Sire (optional)</label>
                    </div>
                    <div class="col s6 input-field">
                        <input v-model="parents.damRegNo"
                            :id="categoryWithDash + 'gpDam'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'gpDam'">GP Dam (optional)</label>
                    </div>
                    <div class="col s12">
                        <button @click.prevent="triggerGetParentsEvent()"
                            class="btn waves-effect waves-light right"
                            type="submit"
                            name="action"
                        >
                            Add Parents <i class="material-icons right">add</i>
                        </button>
                    </div>

                    <!-- More info for GP 1 -->
                    <div class="col s12 input-field">
                        <input v-model="gpOne.adg"
                            :id="categoryWithDash + 'adg'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'adg'">Average Daily Gain (g/day)</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.bft"
                            :id="categoryWithDash + 'bft'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'bft'">Backfat Thickness (mm)</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.fe"
                            :id="categoryWithDash + 'feed-efficiency'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.birth_weight"
                            :id="categoryWithDash + 'birth-weight'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'birth-weight'">Birth weight</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.littersizeAlive_male"
                            :id="categoryWithDash + 'total-m'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'total-m'">Total (M) born alive</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.littersizeAlive_female"
                            :id="categoryWithDash + 'total-f'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'total-f'">Total (F) born alive</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.parity"
                            :id="categoryWithDash + 'parity'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'parity'">Parity</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.littersize_weaning"
                            :id="categoryWithDash + 'littersize-weaning'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'littersize-weaning'">Littersize at weaning</label>
                    </div>
                    <div class="col s12 input-field">
                        <input v-model="gpOne.litterweight_weaning"
                            :id="categoryWithDash + 'litterweight-weaning'"
                            type="text"
                            class="validate"
                        >
                        <label :for="categoryWithDash + 'litterweight-weaning'">Litter weight at weaning</label>
                    </div>
                    <div class="col s12 input-field">
                        <custom-input-date v-model="gpOne.date_weaning" @date-select="val => {gpOne.date_weaning = val}"> </custom-input-date>
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
</template>

<script>
    export default {
        props: [
            'category', 'data'
        ],

        data() {
            return {
                parents: {
                    sireRegNo: '',
                    damRegNo: ''
                },
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

        computed: {
            categoryWithDash() {
                return this.category + '-';
            },
            titleCategory() {
                return _.toUpper(this.category);
            }
        },

        methods: {
            objectIsEmpty(obj) {
                return _.isEmpty(obj);
            },

            triggerGetParentsEvent() {
                this.$emit('getParentsEvent', {
                    sireRegNo: this.parents.sireRegNo,
                    damRegNo: this.parents.damRegNo
                });
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
