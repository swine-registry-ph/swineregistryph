<template lang="html">
    <div id="photos" class="row">
        <div class="card col s12">
            <div class="card-content">
                <span class="card-title center-align">Upload Photos</span>
                <br/>

                <h5>{{ gpOneRegistrationNo }}</h5>

                <blockquote class="info">
                    Please upload good quality images with recommended
                    <b>side</b>, <b>front</b>, <b>back</b>, and <b>top</b> orientations. <br/>
                    Recommended image file formats are <b>JPEG</b> and <b>PNG</b>.
                </blockquote>
                <br/><br/>

                <div class="row">
                    <!-- Side View -->
                    <div class="col s6 m6 l3">
                        <h6><b>Side View *</b></h6>
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

                    <div class="col s12">
                        <p>
                            <br/>
                            * Photo in side view orientation is required.
                        </p>
                    </div>

                </div>
            </div>

            <div id="photos-card-action" class="card-action center-align">
                 <button @click.prevent="savePhotos($event)"
                    href="#!"
                    class="btn waves-effect waves-light save-photos-button"
                    type="submit"
                    name="action"
                >
                    Save Photos
                </button>
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
            },

            gpOneRegistrationNo() {
                return this.$store.state.registerSwine.gpOne.regNo;
            }
        },

        methods: {
            addPhotoToImageFiles(imageDetails) {
                // Put information of uploaded photos in vuex state
                this.$store.commit('addToImageFiles', 
                    {
                        imageDetails: imageDetails.data,
                        orientation: imageDetails.orientation
                    }
                );
            },

            removePhotoFromImageFiles(imageDetails) {
                // Remove photo from vuex state
                this.$store.commit('removeFromImageFiles', 
                    {
                        orientation: imageDetails.orientation
                    }
                );
            },

            savePhotos(event) {
                const sidePhoto = this.imageFiles.side;

                // Check if there is a side photo
                if(!_.isEmpty(sidePhoto)) {
                    const savePhotosButton = $('.save-photos-button');

                    this.disableButtons(savePhotosButton, event.target, 'Saving...');
                    Materialize.toast('Photos saved.', 1500, 'green lighten-1');

                    // Remove onbeforeunload event
                    window.onbeforeunload = null;

                    // Reload page
                    setTimeout(() => {
                        window.location.reload();
                    }, 1600);
                }
                else {
                    Materialize.toast('Photo in side view orientation is required.', 3500, 'orange darken-1');
                }
            },

            disableButtons(buttons, actionBtnElement, textToShow) {
                buttons.addClass('disabled');
                actionBtnElement.innerHTML = textToShow;
            }
        },

        mounted() {
            console.log('Component mounted.');
        }
    }
</script>

<style scoped lang="css">
    #photos > .card {
        padding: 0;
    }

    #photos-card-action {
        border-top: 0;
        background-color: rgba(236, 239, 241, 0.7);
    }

    #uploaded-photos-container {
        margin-top: 3rem;
    }

</style>
