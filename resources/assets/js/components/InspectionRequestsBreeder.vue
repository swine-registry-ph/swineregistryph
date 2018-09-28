<template lang="html">
    <div class="col s10 offset-s1">

        <div class="col s12">
            <h4 class="title-page"> Inspection Requests </h4>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            inspectionRequests: Array
        },

        data() {
            return {

            }
        },

        computed: {

        },

        methods: {

        }
    }
</script>

<style scoped lang="css">
    .tab a.active {
        color: #c62828 !important;
    }

    .tab.disabled a {
        color: #9e9e9e !important;
        cursor: not-allowed !important;
    }

    .tabs .indicator {
        background-color: #c62828 !important;
    }
</style>
