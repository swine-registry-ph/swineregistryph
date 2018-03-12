<template lang="html">
    <div id="summary" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">Summary</span>

                <div class="row">

                    <!-- Swine Information -->
                    <div id="swineinfo-container" class="col s12 m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>Swine Information</b>
                                </h6>

                                <table class="">
                                    <tbody>
                                        <tr>
                                            <td> GP Sire </td>
                                            <td> {{ gpSire }}</td>
                                        </tr>
                                        <tr>
                                            <td> GP Dam </td>
                                            <td> {{ gpDam }}</td>
                                        </tr>
                                        <tr>
                                            <td> Breed </td>
                                            <td> {{ basicInfo.breed }}</td>
                                        </tr>
                                        <tr>
                                            <td> Sex </td>
                                            <td> {{ basicInfo.sex }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Date </td>
                                            <td> {{ basicInfo.birthDate }}</td>
                                        </tr>
                                        <tr>
                                            <td> Weight when data was collected </td>
                                            <td> {{ basicInfo.weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Farm From </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
                                        </tr>
                                        <tr>
                                            <td> Date collected </td>
                                            <td> {{ basicInfo.dateCollected }}</td>
                                        </tr>
                                        <tr>
                                            <td> Average Daily Gain </td>
                                            <td> {{ gpOneData.adg }}</td>
                                        </tr>
                                        <tr>
                                            <td> Backfat Thickness </td>
                                            <td> {{ gpOneData.bft }}</td>
                                        </tr>
                                        <tr>
                                            <td> Feed Efficiency </td>
                                            <td> {{ gpOneData.fe }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Weight </td>
                                            <td> {{ gpOneData.birth_weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Total (M) born alive </td>
                                            <td> {{ gpOneData.littersizeAlive_male }}</td>
                                        </tr>
                                        <tr>
                                            <td> Total (F) born alive </td>
                                            <td> {{ gpOneData.littersizeAlive_female }}</td>
                                        </tr>
                                        <tr>
                                            <td> Parity </td>
                                            <td> {{ gpOneData.parity }}</td>
                                        </tr>
                                        <tr>
                                            <td> Littersize at Weaning </td>
                                            <td> {{ gpOneData.littersize_weaning }}</td>
                                        </tr>
                                        <tr>
                                            <td> Total litterweight at weaning </td>
                                            <td> {{ gpOneData.litterweight_weaning }}</td>
                                        </tr>
                                        <tr>
                                            <td> Date at Weaning </td>
                                            <td> {{ gpOneData.date_weaning }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col s12 m12 l6">
                        <!-- SwineCart -->
                        <div id="swinecart-container" class="col s12">
                            <div class="card">
                                <div class="card-content">
                                    <h6 class="center-align">
                                        <b>SwineCart</b>
                                    </h6>
                                    <div class="row">
                                        <div class="col s12">
                                            <input type="checkbox" id="check-swinecart" class="filled-in"/>
                                            <label for="check-swinecart">Include this swine in SwineCart?</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Genetic Information -->
                        <div id="geneticinfo-container" class="col s12">
                            <div class="card">
                                <div class="card-content">
                                    <h6 class="center-align">
                                        <b>Genetic Information</b>
                                    </h6>
                                    <div class="row">
                                        <div class="col s12 input-field">
                                            <input type="text" id="geneticinfo-id" class="validate">
                                            <label for="geneticinfo-id">Genetic Information ID # (optional)</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- For Photos -->
                    <div id="photos-container" class="col s12">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>Photos</b>
                                </h6>
                                <div class="row">
                                    <div class="col s12 m6"
                                        v-for="photo in summaryImageFiles"
                                    >
                                        <div class="card">
                                            <div class="card-image">
                                                <img :src="photo.fullFilePath">
                                                <span class="card-title"></span>
                                            </div>
                                            <div class="card-action">
                                                <a href="#!"
                                                    v-if="photo.isPrimaryPhoto"
                                                    @click.prevent=""
                                                >
                                                    <i class="material-icons left">photo</i> Primary Photo
                                                </a>
                                                <a href="#!"
                                                    v-else
                                                    @click.prevent="setAsPrimaryPhoto(photo.id)"
                                                >
                                                    Set as Primary
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- For Breed Registry certificate -->
                    <div class="col s12 center-align">
                        <a :href="generateCertificateLink"
                            class="btn waves-effect waves-light"
                            type="submit"
                            name="action"
                        >
                            Submit and Generate Certificate
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'basicInfo', 'gpOneData', 'gpSire', 'gpDam', 'imageFiles',
            'breeds', 'farmoptions'
        ],

        data() {
            return {
                summaryImageFiles: this.imageFiles,
                currentPrimaryPhotoIndex: -1
            }
        },

        computed: {
            generateCertificateLink() {
                const certificateLink = '/breeder/registry-certificate';
                return `${certificateLink}/${this.basicInfo.id}`;
            }
        },

        methods: {
            getIndex(id, arrayToBeSearched) {
                // Return index of object to find
                for(var i = 0; i < arrayToBeSearched.length; i++) {
                    if(arrayToBeSearched[i].id === id) return i;
                }
            },

            setAsPrimaryPhoto(chosenPhotoId) {
                const vm = this;
                const index = this.getIndex(chosenPhotoId, this.summaryImageFiles);
                const currentPrimaryPhotoIndex = this.currentPrimaryPhotoIndex;

                axios.post('/breeder/manage-swine/set-primary-photo', {
                    swineId: vm.basicInfo.id,
                    photoId: chosenPhotoId
                })
                .then((response) => {
                    // Change current primary photo if there is any
                    if(currentPrimaryPhotoIndex >= 0) vm.summaryImageFiles[currentPrimaryPhotoIndex].isPrimaryPhoto = false;

                    vm.summaryImageFiles[index].isPrimaryPhoto = true;
                    vm.currentPrimaryPhotoIndex = index;
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        },

        mounted() {
            console.log('Component mounted.');
        }
    }
</script>

<style lang="css">
    table td {
        padding: 0;
    }

    tr td:first-child {
        color: #757575;
    }

    tr td:last-child {
        color: black;
    }

    #swinecart-container div.row,
    #geneticinfo-container div.row {
        margin-bottom: 0px;
    }

    #swinecart-container div.row {
        padding-top: 1rem;
    }

    #swineinfo-container > .card {
        border-top: 4px solid #2672a6;
    }

    #swinecart-container > .card {
        border-top: 4px solid #26a69a;
    }

    #geneticinfo-container > .card {
        border-top: 4px solid #26a65a;
    }

    #photos-container > .card {
        border-top: 4px solid #a62632;
    }
</style>
