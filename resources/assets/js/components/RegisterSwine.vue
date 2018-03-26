<template lang="html">
    <div class="col s10 offset-s1">

        <div class="col s12">
            <h4 class="title-page"> Register Swine </h4>
        </div>

        <div class="row" style="margin-bottom:0;">
            <div id="add-swine-tabs" class="col s12" style="margin-top:2rem; padding:0;">
                <ul class="tabs tabs-fixed-width z-depth-2">
                    <li class="tab col s3"><a href="#basic-information">Basic Information</a></li>
                    <li class="tab col s2"><a href="#gp-1">GP1</a></li>
                    <li class="tab col s3"><a href="#gp-parents">GP Parents</a></li>
                    <li class="tab col s2" :class="{ 'disabled' : tabDisables.photos }"><a href="#photos">Photos</a></li>
                    <li class="tab col s2" :class="{ 'disabled' : tabDisables.summary }"><a href="#summary">Summary</a></li>
                </ul>
            </div>
        </div>

        <!-- Basic Info tab -->
        <div id="basic-information" class="row">
            <div class="card col s12">
                <div class="card-content">
                    <span class="card-title center-align">Basic Information</span>
                    <div class="row">
                        <div class="col s12 m6 l4 offset-m3 offset-l4">
                            <div class="col s12">
                                <br>
                            </div>

                            <!-- Breed -->
                            <div class="input-field col s12">
                                <app-input-select
                                    labelDescription="Breed"
                                    v-model="basicInfo.breed"
                                    :options="breeds"
                                    @select="val => {basicInfo.breed = val}"
                                >
                                </app-input-select>
                            </div>
                            <!-- Sex -->
                            <div class="input-field col s12">
                                <app-input-select
                                    labelDescription="Sex"
                                    v-model="basicInfo.sex"
                                    :options="[{text:'Male', value:'male'}, {text:'Female', value:'female'}]"
                                    @select="val => {basicInfo.sex = val}"
                                >
                                </app-input-select>
                            </div>
                            <!-- Birthdate -->
                            <div class="input-field col s12">
                                <app-input-date
                                    v-model="basicInfo.birthDate"
                                    @date-select="val => {basicInfo.birthDate = val}"
                                >
                                </app-input-date>
                                <label for=""> Birth Date </label>
                            </div>
                            <div class="input-field col s12">
                            <!-- Date Collected -->
                                <app-input-date
                                    v-model="basicInfo.dateCollected"
                                    @date-select="val => {basicInfo.dateCollected = val}"
                                >
                                </app-input-date>
                                <label for=""> Date when data was collected </label>
                            </div>
                            <!-- Farm From -->
                            <div class="input-field col s12">
                                <app-input-select
                                    labelDescription="Farm From"
                                    v-model="basicInfo.farmFrom"
                                    :options="farmoptions"
                                    @select="val => {basicInfo.farmFrom = val}"
                                >
                                </app-input-select>
                            </div>
                            <div class="col s12">
                                <br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- GP 1 tab component -->
        <register-swine-properties
            v-on:submitSwineInfoEvent="addSwineInfo"
        >
        </register-swine-properties>

        <!-- GP Parents tab component -->
        <register-swine-parents-properties
            :farmoptions="farmoptions"
            v-on:getParentsEvent="getParents"
        >
        </register-swine-parents-properties>

        <!-- Upload photos tab -->
        <register-swine-upload-photo
            :swine-id="basicInfo.id"
            :uploadurl="uploadurl"
            v-on:addedPhotoEvent="addPhotoToImageFiles"
            v-on:removedPhotoEvent="removePhotoFromImageFiles"
        >
        </register-swine-upload-photo>

        <!-- Summary tab -->
        <register-swine-summary
            :basic-info="basicInfo"
            :gp-one-data="gpOneData"
            :gp-sire="gpSireData.registration_no"
            :gp-dam="gpDamData.registration_no"
            :image-files="imageFiles"
            :breeds="breeds"
            :farmoptions="farmoptions"
        >
        </register-swine-summary>

    </div>
</template>

<script>
    export default {
        props: {
            farmoptions: Array,
            breeds: Array,
            uploadurl: String
        },

        data() {
            return {
                tabDisables: {
                    photos: true,
                    summary: true
                },
                gpSireData: {},
                gpDamData: {},
                gpOneData: {},
                basicInfo: {
                    id: 0,
                    breed: '',
                    sex: '',
                    birthDate: '',
                    dateCollected: '',
                    farmFrom: '',
                },
                imageFiles: []
            }
        },

        methods: {
            getIndex(id, arrayToBeSearched) {
                // Return index of object to find
                for(var i = 0; i < arrayToBeSearched.length; i++) {
                    if(arrayToBeSearched[i].id === id) return i;
                }
            },

            getSireInfo(sireRegNo) {
                const vm = this;

                // Fetch from server Sire details
                axios.get(`/breeder/manage-swine/get/${sireRegNo}`)
                    .then((response) => {
                        // Put response in local data storage
                        // and enable 'GP Sire' tab
                        vm.gpSireData = response.data;
                        vm.tabDisables.gpSire = false;

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
                        // Put response in local data storage
                        // and enable 'GP Dam' tab
                        vm.gpDamData = response.data;
                        vm.tabDisables.gpDam = false;

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
                    gpSireId: (vm.gpSireData) ? vm.gpSireData.id : null,
                    gpDamId: (vm.gpDamData) ? vm.gpDamData.id : null,
                    gpOne: vm.gpOneData,
                    basicInfo: vm.basicInfo
                })
                .then((response) => {
                    // Put response in local data storage
                    // and enable 'Photos' tab
                    vm.basicInfo.id = response.data;
                    vm.tabDisables.photos = false;
                    vm.tabDisables.swinecart = false;
                    vm.tabDisables.geneticInfo = false;

                    Materialize.toast('Swine info added', 2000, 'green lighten-1');
                })
                .catch((error) => {
                    console.log(error);
                });
            },

            addPhotoToImageFiles(imageDetails) {
                // Put information of uploaded photos in local data storage
                // and enable 'Summary' tab
                this.imageFiles.push(imageDetails.data);
                this.tabDisables.summary = false;
            },

            removePhotoFromImageFiles(imageDetails) {
                // Remove photo from local data storage
                // and check if 'Summary' tab
                // should still be enabled
                const index = this.getIndex(imageDetails.photoId, this.imageFiles);

                this.imageFiles.splice(index,1);
                this.tabDisables.summary = (this.imageFiles.length < 1) ? true : false;
            }
        },

        mounted() {
            console.log('Component mounted.');
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
</style>
