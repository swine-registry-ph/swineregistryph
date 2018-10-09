<template>
    <div class="col s12">

        <div class="col s12">
            <h4 class="title-page"> Add Swine to Inspection Request </h4>
        </div>

        <div class="col s12">
            <a @click.prevent="hideAddSwineView"
                id="back-to-viewing-btn"
                href="#!"
                class="btn custom-secondary-btn blue-text text-darken-1 z-depth-0"
            >
                <i class="material-icons left">keyboard_arrow_left</i>
                Back To Viewing
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {

        },

        data() {
            return {

            }
        },

        methods: {
            hideAddSwineView() {
                this.$emit('hideAddSwineViewEvent');
            },
        }
    }
</script>

<style scoped>
    .custom-secondary-btn {
        border: 1px solid;
        background-color: white !important;
    }
</style>
