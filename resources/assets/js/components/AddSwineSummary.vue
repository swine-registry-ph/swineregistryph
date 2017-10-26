<template lang="html">
    <div id="summary" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">Summary</span>

                <div class="col s12">
                    <span>Photos</span>
                    <div class="divider"> </div>
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

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'swineId', 'imageFiles'
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
