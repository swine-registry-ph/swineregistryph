<template>
    <div :id="category" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title">{{ titleCategory }}</span>

                <div v-if="category === 'gp-1'" class="">

                </div>

                <div v-if="data">
                    <div class="input-field">
                        <input v-model="data.adg"
                            :id="categoryWithDash + 'adg'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'adg'">Average Daily Gain (g/day)</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.bft"
                            :id="categoryWithDash + 'bft'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'bft'">Backfat Thickness (mm)</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.fe"
                            :id="categoryWithDash + 'feed-efficiency'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.birth_weight"
                            :id="categoryWithDash + 'birth-weight'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'birth-weight'">Birth weight</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.littersize_male"
                            :id="categoryWithDash + 'total-m'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'total-m'">Total (M) when born</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.littersize_female"
                            :id="categoryWithDash + 'total-f'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'total-f'">Total (F) when born</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.littersize_alive"
                            :id="categoryWithDash + 'littersize-alive'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'littersize-alive'">Littersize born alive</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.parity"
                            :id="categoryWithDash + 'parity'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'parity'">Parity</label>
                    </div>
                    <div class="input-field">
                        <input v-model="littersize_weaning"
                            :id="categoryWithDash + 'littersize-weaning'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'littersize-weaning'">Littersize at weaning</label>
                    </div>
                    <div class="input-field">
                        <input v-model="data.litterweight_weaning"
                            :id="categoryWithDash + 'litterweight-weaning'"
                            type="text"
                            class="validate"
                            disabled
                        >
                        <label :for="categoryWithDash + 'litterweight-weaning'">Litter weight at weaning</label>
                    </div>
                </div>
                <div v-else>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'adg'" type="text" class="validate">
                        <label :for="categoryWithDash + 'adg'">Average Daily Gain (g/day)</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'adg'" type="text" class="validate">
                        <label :for="categoryWithDash + 'adg'">Average Daily Gain (g/day)</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'adg'" type="text" class="validate">
                        <label :for="categoryWithDash + 'adg'">Average Daily Gain (g/day)</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'bft'" type="text" class="validate">
                        <label :for="categoryWithDash + 'bft'">Backfat Thickness (mm)</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'feed-efficiency'" type="text" class="validate">
                        <label :for="categoryWithDash + 'feed-efficiency'">Feed Efficiency (gain/feed)</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'birth-weight'" type="text" class="validate">
                        <label :for="categoryWithDash + 'birth-weight'">Birth weight</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'total-m'" type="text" class="validate">
                        <label :for="categoryWithDash + 'total-m'">Total (M) when born</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'total-f'" type="text" class="validate">
                        <label :for="categoryWithDash + 'total-f'">Total (F) when born</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'littersize-alive'" type="text" class="validate">
                        <label :for="categoryWithDash + 'littersize-alive'">Littersize born alive</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'parity'" type="text" class="validate">
                        <label :for="categoryWithDash + 'parity'">Parity</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'littersize-weaning'" type="text" class="validate">
                        <label :for="categoryWithDash + 'littersize-weaning'">Littersize at weaning</label>
                    </div>
                    <div class="input-field">
                        <input :id="categoryWithDash + 'litterweight-weaning'" type="text" class="validate">
                        <label :for="categoryWithDash + 'litterweight-weaning'">Litter weight at weaning</label>
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

        },
        computed: {
            categoryWithDash() {
                return this.category + '-';
            },
            titleCategory() {
                return _.toUpper(this.category);
            }
        },
        mounted() {
            console.log('Component mounted.');
        }
    }
</script>
