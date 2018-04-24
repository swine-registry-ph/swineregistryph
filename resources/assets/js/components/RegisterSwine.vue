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
                    <li class="tab col s2" :class="{ 'disabled' : tabDisables.summary }"><a href="#summary">Summary</a></li>
                    <li class="tab col s2" :class="{ 'disabled' : tabDisables.photos }"><a href="#photos">Photos</a></li>
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
                                    v-model="gpOneBreedId"
                                    :options="breeds"
                                    @select="val => {gpOneBreedId = val}"
                                >
                                </app-input-select>
                            </div>
                            <!-- Sex -->
                            <div class="input-field col s12">
                                <app-input-select
                                    labelDescription="Sex"
                                    v-model="gpOneSex"
                                    :options="[{text:'Male', value:'male'}, {text:'Female', value:'female'}]"
                                    @select="val => {gpOneSex = val}"
                                >
                                </app-input-select>
                            </div>
                            <!-- Birthdate -->
                            <div class="input-field col s12">
                                <app-input-date
                                    v-model="gpOneBirthDate"
                                    @date-select="val => {gpOneBirthDate = val}"
                                >
                                </app-input-date>
                                <label for=""> Birth Date </label>
                            </div>
                            <!-- Farm of Origin / Farm From -->
                            <div class="input-field col s12">
                                <app-input-select
                                    labelDescription="Farm Of Origin"
                                    v-model="gpOneFarmFromId"
                                    :options="farmoptions"
                                    @select="val => {gpOneFarmFromId = val}"
                                >
                                </app-input-select>
                            </div>
                            <div class="col s12">
                                <br>
                            </div>
                        </div>

                        <!-- Tab navigatoin links -->
                        <div class="col s12">
                            <a class="btn-floating btn-large waves-effect waves-light blue right"
                                @click.prevent="goToTab('gp-1')"
                            >
                                <i class="material-icons">arrow_forward</i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- GP 1 tab component -->
        <register-swine-properties
            v-on:goToTabEvent="goToTab"
        >
        </register-swine-properties>

        <!-- GP Parents tab component -->
        <register-swine-parents-properties
            :farmoptions="farmoptions"
            v-on:goToTabEvent="goToTab"
        >
        </register-swine-parents-properties>

        <!-- Summary tab -->
        <register-swine-summary
            :breeds="breeds"
            :farmoptions="farmoptions"
        >
        </register-swine-summary>

        <!-- Upload photos tab -->
        <register-swine-upload-photo
            :uploadurl="uploadurl"
            v-on:addedPhotoEvent="addPhotoToImageFiles"
            v-on:removedPhotoEvent="removePhotoFromImageFiles"
        >
        </register-swine-upload-photo>

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
                    summary: true,
                    photos: true
                }
            }
        },

        computed: {
            gpOneBreedId: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.breedId; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'breedId',
                        value: value
                    });
                }
            },
            gpOneSex: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.sex; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'sex',
                        value: value
                    });
                }
            },
            gpOneBirthDate: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.birthDate; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'birthDate',
                        value: value
                    });
                }
            },
            gpOneFarmFromId: {
                // get and set value from vuex store
                get() { return this.$store.state.registerSwine.gpOne.farmFromId; },
                set(value) {
                    this.$store.commit('updateValue', {
                        instance: 'gpOne',
                        property: 'farmFromId',
                        value: value
                    });
                }
            }
        },

        methods: {
            getIndex(id, arrayToBeSearched) {
                // Return index of object to find
                for(var i = 0; i < arrayToBeSearched.length; i++) {
                    if(arrayToBeSearched[i].id === id) return i;
                }
            },

            goToTab(tabId) {
                // Function used in tab navigation links
                (tabId === 'summary') ? this.tabDisables.summary = false : this.tabDisables.summary = true;

                this.$nextTick(() => {
                    $('#add-swine-tabs ul.tabs').tabs('select_tab', tabId);
                });

            },

            addPhotoToImageFiles(imageDetails) {
                // Put information of uploaded photos in local data storage
                // and enable 'Summary' tab
                // this.imageFiles.push(imageDetails.data);
                // this.tabDisables.summary = false;
            },

            removePhotoFromImageFiles(imageDetails) {
                // Remove photo from local data storage
                // and check if 'Summary' tab
                // should still be enabled
                // const index = this.getIndex(imageDetails.photoId, this.imageFiles);
                //
                // this.imageFiles.splice(index,1);
                // this.tabDisables.summary = (this.imageFiles.length < 1) ? true : false;
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
