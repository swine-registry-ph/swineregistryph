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
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align">Basic Information</span>
                    <p class="row">
                        <!-- Breed -->
                        <div class="input-field col s6">
                            <custom-input-select
                                v-model="basicInfo.breed"
                                @select="val => {basicInfo.breed = val}"
                                labelDescription="Breed"
                                :options="breeds"
                            >
                            </custom-input-select>
                        </div>
                        <!-- Sex -->
                        <div class="input-field col s6">
                            <custom-input-select
                                v-model="basicInfo.sex"
                                @select="val => {basicInfo.sex = val}"
                                labelDescription="Sex"
                                :options="[{text:'Male', value:'male'}, {text:'Female', value:'female'}]"
                            >
                            </custom-input-select>
                        </div>
                        <!-- Birthdate -->
                        <div class="input-field col s6">
                            <custom-input-date
                                v-model="basicInfo.birthDate"
                                @date-select="val => {basicInfo.birthDate = val}"
                            >
                            </custom-input-date>
                            <label for=""> Birth Date </label>
                        </div>
                        <div class="input-field col s6">
                        <!-- Date Collected -->
                            <custom-input-date
                                v-model="basicInfo.dateCollected"
                                @date-select="val => {basicInfo.dateCollected = val}"
                            >
                            </custom-input-date>
                            <label for=""> Date when data was collected </label>
                        </div>
                        <!-- Weight -->
                        <div class="input-field col s6">
                            <input v-model="basicInfo.weight"
                                id="weight"
                                type="text"
                                class="validate"
                            >
                            <label for="weight">Weight when data was collected</label>
                        </div>
                        <!-- Farm From -->
                        <div class="input-field col s6">
                            <custom-input-select
                                v-model="basicInfo.farmFrom"
                                @select="val => {basicInfo.farmFrom = val}"
                                labelDescription="Farm From"
                                :options="farmoptions"
                            >
                            </custom-input-select>
                        </div>
                        <div class="col s12">
                            <br>
                        </div>
                    </p>
                </div>
            </div>
        </div>

        <!-- GP 1 tab component -->
        <swine-properties
            category="gp-1"
            data=""
            v-on:getParentsEvent="getParents"
            v-on:submitSwineInfoEvent="addSwineInfo"
        >
        </swine-properties>

        <!-- GP Sire tab component -->
        <swine-properties
            category="gp-sire"
            :data="gpSireData"
        >
        </swine-properties>

        <!-- GP Dam tab component -->
        <swine-properties
            category="gp-dam"
            :data="gpDamData"
        >
        </swine-properties>

        <!-- Upload photos tab -->
        <upload-photo
            :swine-id="basicInfo.id"
            :uploadurl="uploadurl"
        >
        </upload-photo>

        <!-- Summary tab -->
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
        props: ['farmoptions', 'breeds', 'uploadurl'],

        data() {
            return {
                gpSireData: {},
                gpDamData: {},
                gpOneData: {},
                basicInfo: {
                    id: 0,
                    breed: '',
                    sex: '',
                    birthDate: '',
                    dateCollected: '',
                    weight: '',
                    farmFrom: ''
                }
            }
        },

        methods: {
            getSireInfo(sireRegNo) {
                const vm = this;

                // Fetch from server Sire details
                axios.get(`/breeder/manage-swine/get/${sireRegNo}`)
                    .then((response) => {
                        vm.gpSireData = response.data;
                        Materialize.toast('Sire added', 2000);
                    })
                    .catch((error) => {
                        Materialize.toast('Unable to add Sire', 3000, 'amber lighten-3');
                        console.log(error);
                    });
            },

            getDamInfo(damRegNo) {
                const vm = this;

                // Fetch from server Dam details
                axios.get(`/breeder/manage-swine/get/${damRegNo}`)
                    .then((response) => {
                        vm.gpDamData = response.data;
                        Materialize.toast('Dam added', 2000);
                    })
                    .catch((error) => {
                        Materialize.toast('Unable to add Dam', 3000, 'amber lighten-3');
                        console.log(error);
                    });
            },

            getParents(fetchDetails) {
                this.getSireInfo(fetchDetails.sireRegNo);
                this.getDamInfo(fetchDetails.damRegNo);
            },

            addSwineInfo(gpOneDetails) {
                const vm = this;

                // Update parent component of GP1 details
                this.gpOneData = gpOneDetails.data;

                // Add to server's database
                axios.post('/breeder/manage-swine/register', {
                    gpSireId: (vm.gpSireData) ? vm.gpSireData.id : 0,
                    gpDamId: (vm.gpDamData) ? vm.gpDamData.id : 0,
                    gpOne: vm.gpOneData,
                    basicInfo: vm.basicInfo
                })
                .then((response) => {
                    Materialize.toast('Swine info added', 2000, 'green lighten-1');
                    this.basicInfo.id = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        },

        mounted() {
            console.log('Component mounted.');
        }
    }
</script>
