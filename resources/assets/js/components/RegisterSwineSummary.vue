<template lang="html">
    <div id="summary" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">Summary</span>

                <div class="row">
                    <div class="col s12">
                        <br>
                    </div>

                    <!-- Swine Information -->
                    <div id="swineinfo-container" class="col s12 m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>Swine Information</b>
                                </h6>

                                <table id="swine-summary-table" class="">
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
                                            <td> Farm From </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
                                        </tr>
                                        <tr>
                                            <td> Farm Swine ID / Earmark </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
                                        </tr>
                                        <tr>
                                            <td> Genetic Information ID (optional) </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
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
                                            <td> Teat Number </td>
                                            <td> {{ basicInfo.sex }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Date </td>
                                            <td> {{ basicInfo.birthDate }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Weight </td>
                                            <td> {{ gpOneData.birth_weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Date collected </td>
                                            <td> {{ basicInfo.dateCollected }}</td>
                                        </tr>
                                        <tr>
                                            <td> Weight when data was collected </td>
                                            <td> {{ basicInfo.weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Average Daily Gain from Birth </td>
                                            <td> {{ gpOneData.adg }}</td>
                                        </tr>
                                        <tr>
                                            <td> Average Daily Gain on Test </td>
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

                    <!-- SwineCart -->
                    <div id="swinecart-container"class="col s12 m12 l6">
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
                </div>

                <div class="row">
                    <!-- GP Sire Information -->
                    <div id="gp-sire-container" class="col s12 m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>GP Sire Information</b>
                                </h6>

                                <table id="swine-summary-table" class="">
                                    <tbody>
                                        <tr>
                                            <td> Farm From </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
                                        </tr>
                                        <tr>
                                            <td> Farm Swine ID / Earmark </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
                                        </tr>
                                        <tr>
                                            <td> Genetic Information ID (optional) </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
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
                                            <td> Teat Number </td>
                                            <td> {{ basicInfo.sex }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Date </td>
                                            <td> {{ basicInfo.birthDate }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Weight </td>
                                            <td> {{ gpOneData.birth_weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Date collected </td>
                                            <td> {{ basicInfo.dateCollected }}</td>
                                        </tr>
                                        <tr>
                                            <td> Weight when data was collected </td>
                                            <td> {{ basicInfo.weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Average Daily Gain from Birth </td>
                                            <td> {{ gpOneData.adg }}</td>
                                        </tr>
                                        <tr>
                                            <td> Average Daily Gain on Test </td>
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

                    <!-- GP Dam Information -->
                    <div id="gp-dam-container" class="col s12 m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <h6 class="center-align">
                                    <b>GP Dam Information</b>
                                </h6>

                                <table id="swine-summary-table" class="">
                                    <tbody>
                                        <tr>
                                            <td> Farm From </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
                                        </tr>
                                        <tr>
                                            <td> Farm Swine ID / Earmark </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
                                        </tr>
                                        <tr>
                                            <td> Genetic Information ID (optional) </td>
                                            <td> {{ basicInfo.farmFrom }}</td>
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
                                            <td> Teat Number </td>
                                            <td> {{ basicInfo.sex }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Date </td>
                                            <td> {{ basicInfo.birthDate }}</td>
                                        </tr>
                                        <tr>
                                            <td> Birth Weight </td>
                                            <td> {{ gpOneData.birth_weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Date collected </td>
                                            <td> {{ basicInfo.dateCollected }}</td>
                                        </tr>
                                        <tr>
                                            <td> Weight when data was collected </td>
                                            <td> {{ basicInfo.weight }}</td>
                                        </tr>
                                        <tr>
                                            <td> Average Daily Gain from Birth </td>
                                            <td> {{ gpOneData.adg }}</td>
                                        </tr>
                                        <tr>
                                            <td> Average Daily Gain on Test </td>
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

                    <!-- For Breed Registry certificate -->
                    <div class="col s12 center-align">
                        <p>
                            <br>
                        </p>
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
        props: {
            basicInfo: Object,
            gpOneData: Object,
            gpSire: String,
            gpDam: String,
            imageFiles: Array,
            breeds: Array,
            farmoptions: Array
        },

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

<style scoped lang="css">
    #swine-summary-table td {
        padding: 0;
    }

    #swine-summary-table tr td:first-child {
        color: #757575;
    }

    #swine-summary-table tr td:last-child {
        color: black;
    }

    #swinecart-container div.row {
        margin-bottom: 0px;
    }

    #swinecart-container div.row {
        padding-top: 1rem;
    }

    /* Accent highlights on cards */
    #swineinfo-container > .card {
        border-top: 4px solid #2672a6;
    }

    #swinecart-container > .card {
        border-top: 4px solid #26a69a;
    }

    #gp-sire-container > .card {
        border-top: 4px solid #9a26a6;
    }

    #gp-dam-container > .card {
        border-top: 4px solid #a69a26;
    }
</style>
