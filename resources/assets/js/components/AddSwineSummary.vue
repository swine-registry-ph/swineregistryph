<template lang="html">
    <div id="summary" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">Summary</span>

                <!-- For General information -->
                <div class="col s12">
                    <h6>Information</h6>
                    <div class="divider"> </div>
                    <p> <br> </p>
                </div>

                <div class="col s12">
                    <table class="striped">
                        <thead>
                            <tr>
                                <th> Property </th>
                                <th> Value </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> Breed </td>
                                <td> {{ basicInfo.breed }} </td>
                            </tr>
                            <tr>
                                <td> Sex </td>
                                <td> {{ basicInfo.sex }} </td>
                            </tr>
                            <tr>
                                <td> Birth Date </td>
                                <td> {{ basicInfo.birthDate }} </td>
                            </tr>
                            <tr>
                                <td> Weight when data was collected </td>
                                <td> {{ basicInfo.weight }} </td>
                            </tr>
                            <tr>
                                <td> Farm From </td>
                                <td> {{ basicInfo.farmFrom }} </td>
                            </tr>
                            <tr>
                                <td> Date collected </td>
                                <td> {{ basicInfo.dateCollected }} </td>
                            </tr>
                            <tr>
                                <td> GP Sire </td>
                                <td> {{ gpSire }} </td>
                            </tr>
                            <tr>
                                <td> GP Dam </td>
                                <td> {{ gpDam }} </td>
                            </tr>
                            <tr>
                                <td> Average Daily Gain </td>
                                <td> {{ gpOneData.adg }} </td>
                            </tr>
                            <tr>
                                <td> Backfat Thickness </td>
                                <td> {{ gpOneData.bft }} </td>
                            </tr>
                            <tr>
                                <td> Feed Efficiency </td>
                                <td> {{ gpOneData.fe }} </td>
                            </tr>
                            <tr>
                                <td> Birth Weight </td>
                                <td> {{ gpOneData.birth_weight }} </td>
                            </tr>
                            <tr>
                                <td> Total (M) born alive </td>
                                <td> {{ gpOneData.littersizeAlive_male }} </td>
                            </tr>
                            <tr>
                                <td> Total (F) born alive </td>
                                <td> {{ gpOneData.littersizeAlive_female }} </td>
                            </tr>
                            <tr>
                                <td> Parity </td>
                                <td> {{ gpOneData.parity }} </td>
                            </tr>
                            <tr>
                                <td> Littersize at Weaning </td>
                                <td> {{ gpOneData.littersize_weaning }} </td>
                            </tr>
                            <tr>
                                <td> Total litterweight at weaning </td>
                                <td> {{ gpOneData.litterweight_weaning }} </td>
                            </tr>
                            <tr>
                                <td> Date at Weaning </td>
                                <td> {{ gpOneData.date_weaning }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- For Photos -->
                <div class="col s12">
                    <h6>Photos</h6>
                    <div class="divider"> </div>
                    <p> <br> </p>
                </div>

                <div class="col s6"
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

                <!-- For Breed Registry certificate -->
                <div class="col s12">
                    <h6>Breed Registry Certificate</h6>
                    <div class="divider"> </div>
                    <p> <br> </p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'swineId', 'spgSire', 'gpDam', 'basicInfo', 'gpOneData', 'imageFiles'
        ],

        data() {
            return {
                summaryImageFiles: this.imageFiles,
                currentPrimaryPhotoIndex: -1
            }
        },

        methods: {
            searchImageIndex(id) {
                // Return index of imageId to find
                for(var i = 0; i < this.summaryImageFiles.length; i++) {
                    if(this.summaryImageFiles[i].id === id) return i;
                }
            },

            setAsPrimaryPhoto(chosenPhotoId) {
                const vm = this;
                const index = this.searchImageIndex(chosenPhotoId);
                const currentPrimaryPhotoIndex = this.currentPrimaryPhotoIndex;

                axios.post('/breeder/manage-swine/set-primary-photo', {
                    swineId: vm.swineId,
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
