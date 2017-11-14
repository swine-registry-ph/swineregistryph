<template lang="html">
    <div class="col s12">

        <div class="col s12">
            <p> <br> </p>
        </div>

        <div class="col s12">
            <!-- Switch -->
            <div class="switch right">
                <label>
                    <i class="material-icons left">view_module</i>
                    <input type="checkbox"
                        v-model="viewLayout"
                        v-bind:true-value="'list'"
                        v-bind:false-value="'card'"
                    >
                    <span class="lever"></span>
                    <i class="material-icons right">list</i>
                </label>
            </div>
        </div>

        <!-- Card Style -->
        <div v-show="viewLayout === 'card'"
            v-for="swine in swines"
            class="col s4"
        >
            <div class="card">
                <div class="card-image">
                    <img :src="'/storage/images/swine/' + swine.photos[0].name">
                </div>
                <div class="card-content">
                    <span class="card-title">{{ swine.registration_no }}</span>
                    <p class="grey-text">
                        {{ swine.farm.name }}, {{ swine.farm.province }} <br> <br>
                        {{ swine.breed.title }} ({{ swine.swine_properties[0].value }})
                    </p>
                </div>
                <div class="card-action">
                    <a href="#" class="">Certificate</a>
                    <a href="#" class="right">Photos</a>
                </div>
            </div>
        </div>

        <!-- List Style -->
        <div v-show="viewLayout === 'list'"
            class="col s12"
        >
            <ul class="collection">
                <li v-for="swine in swines"
                    class="collection-item avatar"
                >
                    <img :src="'/storage/images/swine/' + swine.photos[0].name" alt="" class="circle">
                    <span class="title">{{ swine.registration_no }}</span>
                    <p class="grey-text">
                        {{ swine.farm.name }}, {{ swine.farm.province }} <br>
                        {{ swine.breed.title }} ({{ swine.swine_properties[0].value }})
                    </p>
                    <div class="secondary-content">
                        <a href="#!" class="btn-flat orange-text text-accent-2">Certificate</a>
                        <a href="#!" class="btn-flat orange-text text-accent-2">Photos</a>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    export default {
        props: ['swines'],

        data() {
            return {
                viewLayout: 'list'
            }
        },

        mounted() {

        }
    }
</script>

<style lang="css">

    .switch label i {
        margin: 0;
    }

    .card-image {
        background-color: white;
    }

    .card-image img {
        margin: 0 auto;
    	width: auto;
    	padding: 0.5rem;
    }

    /* Medium Screen */
    @media only screen and (min-width: 601px){
        /* Image resize */
        .card-image img {
            height: 160px;
        }
    }

    /* Large Screen */
    @media only screen and (min-width: 993px){
        /* Image resize */
        .card-image img {
            height: 168px;
        }
    }

    /* Extra Large Screen */
    @media only screen and (min-width: 1100px){
        /* Image resize */
        .card-image img {
            height: 180px;
        }
    }

    /* Super Extra Large Screen */
    @media only screen and (min-width: 1560px){
        /* Image resize */
        .card-image img {
            height: 210px;
        }
    }

    /* Super Super Extra Large Screen */
    @media only screen and (min-width: 1560px){
        /* Image resize */
        .card-image img {
            height: 270px;
        }
    }

</style>
