<template lang="html">
    <div id="manage-farms-container" class="card">
        <div class="card-content">
            <h5> 
                <b class="name-chosen-breeder">{{ manageFarmsData.name }}</b>
                <i @click.prevent="toggleCloseFarmsDataContainerEvent" 
                    class="material-icons right"
                >
                    close
                </i>
            </h5>
            <br/>
            <h5 class="center-align"> Manage Farms </h5>

            <ul class="collection">
                <li v-for="(farm, index) in manageFarmsData.farms"
                    :key="farm.id"
                    class="collection-item avatar"
                >
                    <span class="farm-title"> <b>{{ farm.name }} ({{ farm.farm_code }})</b> </span>
                    <p class="">
                        Accreditation No. : {{ farm.farm_accreditation_no }} <br/>
                        Accreditation Date. : {{ convertToReadableDate(farm.farm_accreditation_date) }}  <br/>
                    </p>
                    <p class="grey-text address-line">
                        <i class="material-icons left">location_on</i>
                        {{ farm.address_line1 }}, {{ farm.address_line2 }},
                        {{ farm.province }} ({{ farm.province_code }})
                    </p>
                    <a 
                        href="#!" 
                        class="secondary-content btn z-depth-0 custom-secondary-btn blue-text text-darken-1"
                    > 
                        Edit 
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            manageFarmsData: Object
        },

        methods: {
            toggleCloseFarmsDataContainerEvent() {
                this.$emit('close-manage-farms-event', 
                    { 'containerIndex': this.manageFarmsData.containerIndex }
                );
            },

            convertToReadableDate(date) {
                const dateObject = new Date(date);
                const monthConversion = {
                    '0': 'January',
                    '1': 'February',
                    '2': 'March',
                    '3': 'April',
                    '4': 'May', 
                    '5': 'June',
                    '6': 'July',
                    '7': 'August',
                    '8': 'September',
                    '9': 'October',
                    '10': 'November',
                    '11': 'December'
                };
                
                return `${monthConversion[dateObject.getMonth()]} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
            }
        }

    }
</script>

<style lang="css" scoped>
    h5 i {
        cursor: pointer;
    }

    span.farm-title {
        font-size: 18px;
    }

    .custom-secondary-btn {
        border: 1px solid #1E88E5;
        background-color: white;
    }

    p.address-line {
        padding-top: 10px;
    }

    /* Override MaterializeCSS' collection styles */
    ul.collection {
        border: 0;
        margin-top: 2rem;
    }

    li.collection-item {
        border: 0;
        padding-bottom: 2rem;
        padding-left: 0px !important;
        margin-right: 72px;
        margin-left: 72px;
    }

    /* 
    * Card highlights for chosen breeder 
    * upon managing of farms
    */
    #manage-farms-container.card {
        border-top: 8px solid #26a65a;
    }

    .name-chosen-breeder {
        color: #26a65a;
    }

</style>

