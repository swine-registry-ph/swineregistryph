<template lang="html">
    <div id="photos" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">Upload Photos</span>

                <blockquote class="info">
                    Please upload good quality images with recommended
                    <b>side</b>, <b>front</b>, <b>back</b>, and <b>top</b> orientations. <br/>
                    Recommended image file formats are <b>JPEG</b> and <b>PNG</b>.
                </blockquote>

                <div class="row">
                    <!-- Side View -->
                    <div class="col s6 m6 l3">
                        <h6><b>Side View</b></h6>
                        <register-swine-upload-photo-dropzone
                            :dropzoneId="'uploadSidePhotoDropzone'"
                            :orientation="'side'"
                            :swineId="swineId"
                            :uploadurl="uploadurl"
                            v-on:addedPhotoEvent="addPhotoToImageFiles"
                            v-on:removedPhotoEvent="removePhotoFromImageFiles"
                        >
                        </register-swine-upload-photo-dropzone>
                    </div>

                    <!-- Front View -->
                    <div class="col s6 m6 l3">
                        <h6><b>Front View</b></h6>
                        <register-swine-upload-photo-dropzone
                            :dropzoneId="'uploadFrontPhotoDropzone'"
                            :orientation="'front'"
                            :swineId="swineId"
                            :uploadurl="uploadurl"
                            v-on:addedPhotoEvent="addPhotoToImageFiles"
                            v-on:removedPhotoEvent="removePhotoFromImageFiles"
                        >
                        </register-swine-upload-photo-dropzone>
                    </div>

                    <!-- Back View -->
                    <div class="col s6 m6 l3">
                        <h6><b>Back View</b></h6>
                        <register-swine-upload-photo-dropzone
                            :dropzoneId="'uploadBackPhotoDropzone'"
                            :orientation="'back'"
                            :swineId="swineId"
                            :uploadurl="uploadurl"
                            v-on:addedPhotoEvent="addPhotoToImageFiles"
                            v-on:removedPhotoEvent="removePhotoFromImageFiles"
                        >
                        </register-swine-upload-photo-dropzone>
                    </div>

                    <!-- Top View -->
                    <div class="col s6 m6 l3">
                        <h6><b>Top View</b></h6>
                        <register-swine-upload-photo-dropzone
                            :dropzoneId="'uploadTopPhotoDropzone'"
                            :orientation="'top'"
                            :swineId="swineId"
                            :uploadurl="uploadurl"
                            v-on:addedPhotoEvent="addPhotoToImageFiles"
                            v-on:removedPhotoEvent="removePhotoFromImageFiles"
                        >
                        </register-swine-upload-photo-dropzone>
                    </div>

                    <!-- <div class="col s6">
                        <div class="card">
                            <div class="card-image">
                                <img src="/storage/images/swine/duroc_male.jpg">
                            </div>
                            <div class="card-content">
                                <span class="card-title">Sample Side View</span>
                            </div>
                        </div>
                    </div>

                    <div class="col s6">
                        <div class="card">
                            <div class="card-image">
                                <img src="/storage/images/swine/duroc_male.jpg">
                            </div>
                            <div class="card-content">
                                <span class="card-title">Sample Front View</span>
                            </div>
                        </div>
                    </div>

                    <div class="col s6">
                        <div class="card">
                            <div class="card-image">
                                <img src="/storage/images/swine/duroc_male.jpg">
                            </div>
                            <div class="card-content">
                                <span class="card-title">Sample Back View</span>
                            </div>
                        </div>
                    </div>

                    <div class="col s6">
                        <div class="card">
                            <div class="card-image">
                                <img src="/storage/images/swine/duroc_male.jpg">
                            </div>
                            <div class="card-content">
                                <span class="card-title">Sample Top View</span>
                            </div>
                        </div>
                    </div> -->

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import RegisterSwineUploadPhotoDropzone from './RegisterSwineUploadPhotoDropzone.vue';

    export default {
        props: {
            swineId: Number,
            uploadurl: String
        },

        components: {
            RegisterSwineUploadPhotoDropzone
        },

        computed: {
            imageFiles() {
                return this.$store.getters.imageFiles;
            }
        },

        methods: {
            getIndex(id, arrayToBeSearched) {
                // // Return index of object to find
                // for(var i = 0; i < arrayToBeSearched.length; i++) {
                //     if(arrayToBeSearched[i].id === id) return i;
                // }
            },

            addPhotoToImageFiles(imageDetails) {
                // Put information of uploaded photos in local data storage
                this.$store.commit('addToImageFiles', {
                    imageDetails: imageDetails.data,
                    orientation: imageDetails.orientation
                });
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
            console.log('Component mounted.')
        }
    }
</script>

<style scoped lang="scss">
    #uploaded-photos-container {
        margin-top: 3rem;
    }

</style>
