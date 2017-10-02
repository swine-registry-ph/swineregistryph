<template lang="html">
    <div class="col s10 offset-s1">
        <div class="row" style="margin-bottom:0;">
            <div class="col s12" style="margin-top:2rem; padding:0;">
                <ul class="tabs tabs-fixed-width z-depth-2">
                    <li class="tab col s3"><a href="#basic-information">Basic Information</a></li>
                    <li class="tab col s2"><a href="#gp-1">GP1</a></li>
                    <li class="tab col s2"><a href="#gp-sire">GP Sire</a></li>
                    <li class="tab col s2"><a href="#gp-dam">GP Dam</a></li>
                    <li class="tab col s2"><a href="#photos">Photos</a></li>
                    <li class="tab col s2"><a href="#summary">Summary</a></li>
                    <!-- <li class="tab col s2"><a href="#swinecart">SwineCart</a></li> -->
                </ul>
            </div>
        </div>

        <div id="basic-information" class="row">
            <div class="card col s12" style="margin-top:.2rem;">
                <div class="card-content">
                    <span class="card-title center-align">Basic Information</span>
                    <p class="row">
                        <div class="input-field col s6">
                            <input v-model="basicInfo.breed"
                                id="breed"
                                type="text"
                                class="validate"
                            >
                            <label for="breed">Breed</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="basicInfo.sex"
                                id="sex"
                                type="text"
                                class="validate"
                            >
                            <label for="sex">Sex</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="basicInfo.birthDate"
                                id="birth-year"
                                type="date"
                                class="validate datepicker"
                            >
                            <label for="birth-year">Birth Date</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="basicInfo.age"
                                id="age"
                                type="date"
                                class="validate datepicker"
                            >
                            <label for="age">Date when data was collected</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="basicInfo.weight"
                                id="weight"
                                type="text"
                                class="validate"
                            >
                            <label for="weight">Weight when data was collected</label>
                        </div>
                        <div class="col s12">
                            <br>
                        </div>
                    </p>
                </div>
            </div>
        </div>

        <!-- GP 1, GP Sire, and GP Dam tab components -->
        <swine-properties
            :category="'gp-1'"
            :data="''"
            v-on:addParents="getParents"
        >
        </swine-properties>

        <swine-properties
            :category="'gp-sire'"
            :data="gpSireData"
        >
        </swine-properties>

        <swine-properties
            :category="'gp-dam'"
            :data="gpDamData"
        >
        </swine-properties>

        <div id="photos" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align">Upload Photos</span>
                    <p></p>
                </div>
            </div>
        </div>

        <div id="summary" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align">Summary</span>
                    <p></p>
                </div>
            </div>
        </div>

        <!-- <div id="swinecart" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align">Link for SwineCart (E-commerce)</span>
                    <p></p>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
    export default {
        props: [],

        data() {
            return {
                gpSireData: {},
                gpDamData: {},
                basicInfo: {
                    breed: '',
                    sex: '',
                    birthDate: '',
                    age: '',
                    weight: ''
                }
            }
        },

        methods: {
            getSireInfo(sireRegNo) {
                const vm = this;

                axios.get(`/manage-swine/get/${sireRegNo}`)
                    .then(function (response) {
                        vm.gpSireData = response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },

            getDamInfo(damRegNo) {
                const vm = this;

                axios.get(`/manage-swine/get/${damRegNo}`)
                    .then(function (response) {
                        vm.gpDamData = response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },

            getParents(fetchDetails) {
                this.getSireInfo(fetchDetails.sireRegNo);
                this.getDamInfo(fetchDetails.damRegNo);
            }
        },

        mounted() {
            // Initialize datepicker
            $('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 4
            });

            console.log('Component mounted.');
        }
    }
</script>
