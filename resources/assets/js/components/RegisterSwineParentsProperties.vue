<template lang="html">
    <div id="gp-parents" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">GP Parents</span>

                <div class="row">
                    <div class="col s12">
                        <div class="col s12">
                            <br>
                        </div>

                        <!-- Left column on large screens -->
                        <div class="col s12 m12 l6">
                            <!-- GP Sire -->
                            <div class="col s12">
                                <h6><b>GP Sire</b></h6>
                            </div>

                            <!-- GP Sire: radio if existing or new -->
                            <div class="col s12">
                                <p>
                                    Choose an option:
                                </p>
                                <p>
                                    <input v-model="status.sire"
                                        name="sire-status"
                                        type="radio"
                                        id="sire-new"
                                        value="new"
                                    >
                                    <label for="sire-new">Sire is not yet registered in the system</label>
                                </p>
                                <p>
                                    <input v-model="status.sire"
                                        name="sire-status"
                                        type="radio"
                                        id="sire-existing"
                                        value="existing"
                                    >
                                    <label for="sire-existing">Sire is currently registered in the system</label>
                                </p>
                            </div>

                            <div class="col s12">
                                <br>
                            </div>

                            <!-- GP Sire: existing -->
                            <template v-if="status.sire === 'existing'">
                                <div class="col s8 offset-s2 input-field">
                                    <input v-model="existingParents.sireRegNo"
                                        :id="gpSireIdPrefix + 'existing'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'gpSire'">GP Sire Registration #</label>
                                </div>
                            </template>

                            <!-- GP Sire: new -->
                            <template v-else-if="status.sire === 'new'">
                                <!-- GP Sire: properties -->
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.adg"
                                        :id="gpSireIdPrefix + 'adg'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'adg'">Average Daily Gain (g/day)</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.bft"
                                        :id="gpSireIdPrefix + 'bft'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'bft'">Backfat Thickness (mm)</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.fe"
                                        :id="gpSireIdPrefix + 'feed-efficiency'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.birth_weight"
                                        :id="gpSireIdPrefix + 'birth-weight'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'birth-weight'">Birth weight</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.littersizeAlive_male"
                                        :id="gpSireIdPrefix + 'total-m'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'total-m'">Total (M) born alive</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.littersizeAlive_female"
                                        :id="gpSireIdPrefix + 'total-f'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'total-f'">Total (F) born alive</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.parity"
                                        :id="gpSireIdPrefix + 'parity'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'parity'">Parity</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.littersize_weaning"
                                        :id="gpSireIdPrefix + 'littersize-weaning'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpSire.litterweight_weaning"
                                        :id="gpSireIdPrefix + 'litterweight-weaning'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpSireIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                                </div>
                                <div class="col s6 input-field">
                                    <app-input-date
                                        v-model="gpSire.date_weaning"
                                        @date-select="val => {gpSire.date_weaning = val}"
                                    >
                                    </app-input-date>
                                    <label for=""> Date at weaning </label>
                                </div>
                            </template>
                        </div>

                        <!-- Right column on medium and large screens -->
                        <div class="col s12 m12 l6">
                            <!-- GP Dam -->
                            <div class="col s12">
                                <h6><b>GP Dam</b></h6>
                            </div>

                            <!-- GP Dam: radio if existing or new -->
                            <div class="col s12">
                                <p>
                                    Choose an option:
                                </p>
                                <p>
                                    <input v-model="status.dam"
                                        name="dam-status"
                                        type="radio"
                                        id="dam-new"
                                        value="new"
                                    >
                                    <label for="dam-new">Dam is not yet registered in the system</label>
                                </p>
                                <p>
                                    <input v-model="status.dam"
                                        name="dam-status"
                                        type="radio"
                                        id="dam-existing"
                                        value="existing"
                                    >
                                    <label for="dam-existing">Dam is currently registered in the system</label>
                                </p>
                            </div>

                            <div class="col s12">
                                <br>
                            </div>

                            <!-- GP Dam: existing -->
                            <template v-if="status.dam === 'existing'">
                                <div class="col s8 offset-s2 input-field">
                                    <input v-model="existingParents.damRegNo"
                                        :id="gpDamIdPrefix + 'existing'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'gpDam'">GP Dam Registration #</label>
                                </div>
                            </template>

                            <!-- GP Dam: new -->
                            <template v-else-if="status.dam === 'new'">
                                <!-- GP Dam: properties -->
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.adg"
                                        :id="gpDamIdPrefix + 'adg'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'adg'">Average Daily Gain (g/day)</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.bft"
                                        :id="gpDamIdPrefix + 'bft'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'bft'">Backfat Thickness (mm)</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.fe"
                                        :id="gpDamIdPrefix + 'feed-efficiency'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.birth_weight"
                                        :id="gpDamIdPrefix + 'birth-weight'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'birth-weight'">Birth weight</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.littersizeAlive_male"
                                        :id="gpDamIdPrefix + 'total-m'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'total-m'">Total (M) born alive</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.littersizeAlive_female"
                                        :id="gpDamIdPrefix + 'total-f'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'total-f'">Total (F) born alive</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.parity"
                                        :id="gpDamIdPrefix + 'parity'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'parity'">Parity</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.littersize_weaning"
                                        :id="gpDamIdPrefix + 'littersize-weaning'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'littersize-weaning'">Littersize at weaning</label>
                                </div>
                                <div class="col s6 input-field">
                                    <input v-model="gpDam.litterweight_weaning"
                                        :id="gpDamIdPrefix + 'litterweight-weaning'"
                                        type="text"
                                        class="validate"
                                    >
                                    <label :for="gpDamIdPrefix + 'litterweight-weaning'">Litter weight at weaning</label>
                                </div>
                                <div class="col s6 input-field">
                                    <app-input-date
                                        v-model="gpDam.date_weaning"
                                        @date-select="val => {gpDam.date_weaning = val}"
                                    >
                                    </app-input-date>
                                    <label for=""> Date at weaning </label>
                                </div>
                            </template>
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
                                Link Parents <i class="material-icons right">send</i>
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
                gpSireIdPrefix: 'gp-sire-',
                gpDamIdPrefix: 'gp-dam-',
                status: {
                    sire: '',
                    dam: ''
                },
                existingParents: {
                    sireRegNo: '',
                    damRegNo: ''
                },
                gpSire: {
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
                },
                gpDam: {
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

        watch: {
            'status.sire': function() {
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            },

            'status.dam': function() {
                this.$nextTick(() => {
                    Materialize.updateTextFields();
                });
            }
        },

        methods: {
            triggerGetParentsEvent() {
                this.$emit('getParentsEvent', {
                    sireRegNo: this.existingParents.sireRegNo,
                    damRegNo: this.existingParents.damRegNo
                });
            },
        }
    }
</script>

<style scoped lang="css">

</style>
