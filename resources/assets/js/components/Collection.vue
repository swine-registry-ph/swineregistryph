<template>
    <div class="col s10 offset-s1">
        <div class="row" style="margin-bottom:0;">
            <div class="col s12" style="margin-top:2rem; padding:0;">
                <ul class="tabs tabs-fixed-width z-depth-2">
                    <li class="tab col s3"><a href="#basic-information">Basic Information</a></li>
                    <li class="tab col s2"><a href="#gp-1">GP1</a></li>
                    <li class="tab col s2"><a href="#gp-sire">GP Sire</a></li>
                    <li class="tab col s2"><a href="#gp-dam">GP Dam</a></li>
                    <li class="tab col s2"><a href="#summary">Summary</a></li>
                    <li class="tab col s2"><a href="#swinecart">SwineCart</a></li>
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
                            <input v-model="basicInfo.age"
                                id="age"
                                type="text"
                                class="validate"
                            >
                            <label for="age">Age when data was collected</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="basicInfo.weight"
                                id="weight"
                                type="text"
                                class="validate"
                            >
                            <label for="weight">Weight when data was collected</label>
                        </div>
                        <div class="input-field col s6">
                            <input v-model="basicInfo.birthYear"
                                id="birth-year"
                                type="date"
                                class="validate datepicker"
                            >
                            <label for="birth-year">Birth Year</label>
                        </div>
                        <div class="file-field input-field col s8">
                            <div class="btn">
                                <span>Upload Photo</span>
                                <input type="file">
                            </div>
                            <div class="file-path-wrapper">
                                <input class="file-path validate" type="text">
                            </div>
                        </div>
                        <div class="col s12">
                            <br>
                        </div>
                    </p>
                </div>
            </div>
        </div>

        <!-- GP 1, GP Sire, and GP Dam tab containers -->
        <swine-properties v-on:addParents="getParents" :category="'gp-1'" :data="''"></swine-properties>
        <swine-properties :category="'gp-sire'" :data="gpSireData"></swine-properties>
        <swine-properties :category="'gp-dam'" :data="gpDamData"></swine-properties>

        <div id="summary" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align">Summary</span>
                    <p></p>
                </div>
            </div>
        </div>

        <div id="swinecart" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align">Link for SwineCart (E-commerce)</span>
                    <p></p>
                </div>
            </div>
        </div>
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
                    birthYear: '',
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
